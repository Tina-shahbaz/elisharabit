import { connectDB } from "@/app/lib/db";
import User from "@/app/models/User";
import bcrypt from "bcrypt";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { rates } from "@/app/data/rates";

export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const body = await req.json();
    console.log("🔍 DEBUG - Received update data:", { 
      userId: session.user.id,
      skills: body.skills,
      city: body.city,
      email: body.email,
      contactNumber: body.contactNumber,
      availabilityTiming: body.availabilityTiming,
      workingHours: body.workingHours,
      identityVerification: body.identityVerification,
      bio: body.bio
    });

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("🔍 DEBUG - User before update:", {
      currentSkills: user.skills,
      currentCity: user.city,
      currentEmail: user.email,
      currentPhone: user.phone,
      currentCountryCode: user.countryCode,
      currentAvailabilityTiming: user.availabilityTiming,
      currentWorkingHours: user.workingHours
    });

    // --- 🔐 Password Update ---
    if (body.newPassword) {
      if (!body.currentPassword) {
        return NextResponse.json(
          { error: "Current password required." },
          { status: 400 }
        );
      }

      const isValid = await bcrypt.compare(body.currentPassword, user.password);
      if (!isValid)
        return NextResponse.json(
          { error: "Incorrect current password." },
          { status: 400 }
        );

      if (body.newPassword.length < 8)
        return NextResponse.json(
          { error: "Password must be at least 8 characters." },
          { status: 400 }
        );

      const isSamePassword = await bcrypt.compare(
        body.newPassword,
        user.password
      );
      if (isSamePassword)
        return NextResponse.json(
          { error: "New password cannot be same as current." },
          { status: 400 }
        );

      const hashed = await bcrypt.hash(body.newPassword, 10);
      user.password = hashed;
    }

    // --- 🧩 Two-Factor Auth ---
    if (typeof body.twoFA === "boolean") {
      user.twoFA = body.twoFA;
    }

    // --- 📝 Profile Updates - UPDATED WITH ALL NEW FIELDS ---
    const editableFields = [
      "firstName",
      "lastName",
      "username",
      "profileImage",
      "city",
      "bio",
      "availability",
      "identityVerification",
      "fullAddress",
      "availabilityTiming",
      "workingHours",
      "zipCode"
    ];

    for (const field of editableFields) {
      if (body[field] !== undefined) {
        console.log(`🔄 Updating ${field}:`, body[field]);
        user[field] = body[field];
      }
    }

    // --- 📧 Email Update (with validation) ---
    if (body.email && body.email !== user.email) {
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(body.email)) {
        return NextResponse.json(
          { error: "Invalid email format." },
          { status: 400 }
        );
      }

      // Check if email already exists
      const existingEmail = await User.findOne({ 
        email: body.email.toLowerCase(),
        _id: { $ne: session.user.id }
      });
      
      if (existingEmail) {
        return NextResponse.json(
          { error: "Email already in use by another account." },
          { status: 400 }
        );
      }
      
      user.email = body.email.toLowerCase();
      console.log("✅ Updated email:", user.email);
    }

    // --- 📱 Contact Number Update (with parsing) ---
    if (body.contactNumber) {
      // Remove any non-digit characters
      const cleanedNumber = body.contactNumber.replace(/\D/g, '');
      
      if (cleanedNumber.length < 10) {
        return NextResponse.json(
          { error: "Invalid phone number. Must be at least 10 digits." },
          { status: 400 }
        );
      }
      
      // Extract country code (assume first 1-3 digits) and phone number
      let countryCode = "1"; // Default for US/Canada
      let phoneNumber = cleanedNumber;
      
      if (cleanedNumber.length > 10) {
        // Try to extract country code
        countryCode = cleanedNumber.substring(0, cleanedNumber.length - 10);
        phoneNumber = cleanedNumber.substring(countryCode.length);
      }
      
      user.countryCode = `+${countryCode}`;
      user.phone = phoneNumber;
      console.log("✅ Updated contact:", { 
        countryCode: user.countryCode, 
        phone: user.phone,
        fullContact: `${user.countryCode}${user.phone}`
      });
    }

    // --- 🛠️ Skills Update ---
    if (body.skills !== undefined) {
      if (Array.isArray(body.skills)) {
        // Normalize skills to strings
        const normalizedSkills = body.skills
          .map(skill => {
            if (typeof skill === 'string') {
              return skill.trim();
            } else if (skill && typeof skill === 'object' && skill.name) {
              return skill.name.trim();
            }
            return null;
          })
          .filter(skill => skill && skill.length > 0); // Remove empty values
        
        user.skills = normalizedSkills;
        console.log("✅ Normalized skills:", normalizedSkills);
      } else {
        user.skills = [];
      }
    }

    // --- 🧠 Username Uniqueness Check ---
    if (body.username && body.username !== user.username) {
      const existingUser = await User.findOne({ 
        username: body.username.toLowerCase(),
        _id: { $ne: session.user.id }
      });
      if (existingUser) {
        return NextResponse.json(
          { error: "Username already taken." },
          { status: 400 }
        );
      }
      user.username = body.username.toLowerCase();
    }

    // --- 💰 Auto-calculate hourlyRate ---
    if (user.city && Array.isArray(user.skills) && user.skills.length > 0) {
      const cityData = rates.find((r) => r.name === user.city);
      if (cityData) {
        let total = 0;
        const skillNames = [];

        for (const skill of user.skills) {
          const skillName = skill;
          if (skillName && cityData.prices[skillName]) {
            skillNames.push(skillName);
            total += cityData.prices[skillName];
          }
        }

        user.hourlyRate = total;
        console.log(
          "💰 Calculated hourly rate:",
          total,
          "for skills:",
          skillNames,
          "in city:",
          user.city
        );
      } else {
        console.log("❌ City data not found for:", user.city);
        user.hourlyRate = 0;
      }
    } else {
      console.log("❌ City or skills missing for hourly rate calculation");
      user.hourlyRate = 0;
    }

    // --- 🕐 Validate availabilityTiming structure ---
    if (body.availabilityTiming) {
      user.availabilityTiming = {
        startWork: ["today", "tomorrow", "in_one_week"].includes(body.availabilityTiming.startWork)
          ? body.availabilityTiming.startWork
          : "today",
        preferredTime: Array.isArray(body.availabilityTiming.preferredTime)
          ? body.availabilityTiming.preferredTime.filter(time => 
              ["morning", "afternoon", "evening"].includes(time)
            )
          : ["morning", "afternoon", "evening"],
        availableDays: Array.isArray(body.availabilityTiming.availableDays)
          ? body.availabilityTiming.availableDays.filter(day => 
              ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].includes(day)
            )
          : ["monday", "tuesday", "wednesday", "thursday", "friday"]
      };
      console.log("✅ Updated availabilityTiming:", user.availabilityTiming);
    }

    // --- ⏰ Validate workingHours structure ---
    if (body.workingHours) {
      const hoursPerDay = Math.min(Math.max(parseInt(body.workingHours.hoursPerDay) || 8, 1), 24);
      const daysPerWeek = Math.min(Math.max(parseInt(body.workingHours.daysPerWeek) || 5, 1), 7);
      const totalHoursPerWeek = hoursPerDay * daysPerWeek;

      user.workingHours = {
        hoursPerDay: hoursPerDay,
        daysPerWeek: daysPerWeek,
        totalHoursPerWeek: totalHoursPerWeek
      };
      console.log("✅ Updated workingHours:", user.workingHours);
    }

    // Update timestamps
    user.updatedAt = new Date();

    await user.save();

    console.log("✅ User after save:", { 
      id: user._id,
      skills: user.skills,
      skillsLength: user.skills?.length,
      hourlyRate: user.hourlyRate,
      city: user.city,
      email: user.email,
      contact: `${user.countryCode}${user.phone}`,
      availabilityTiming: user.availabilityTiming,
      workingHours: user.workingHours
    });

    // Prepare response user object
    const responseUser = {
      id: user._id.toString(),
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      contactNumber: `${user.countryCode}${user.phone}`,
      city: user.city,
      skills: user.skills,
      bio: user.bio,
      profileImage: user.profileImage || '/d_avatar.png',
      identityVerification: user.identityVerification || {},
      availabilityTiming: user.availabilityTiming || {
        startWork: "today",
        preferredTime: ["morning", "afternoon", "evening"],
        availableDays: ["monday", "tuesday", "wednesday", "thursday", "friday"]
      },
      workingHours: user.workingHours || {
        hoursPerDay: 8,
        daysPerWeek: 5,
        totalHoursPerWeek: 40
      },
      hourlyRate: user.hourlyRate,
      fullAddress: user.fullAddress,
      availability: user.availability,
      username: user.username,
      role: user.role
    };

    return NextResponse.json({ 
      success: true, 
      user: responseUser 
    });
    
  } catch (err) {
    console.error("❌ Update user error:", err);
    return NextResponse.json({ 
      error: "Update failed. Please try again." 
    }, { status: 500 });
  }
}