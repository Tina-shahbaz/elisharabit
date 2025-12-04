import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/app/lib/db";
import User from "@/app/models/User";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ 
        error: "Unauthorized access" 
      }, { status: 401 });
    }

    await connectDB();
    
    // Fetch user with sensitive fields excluded
    const user = await User.findById(session.user.id)
      .select("-password -otp -otpExpiresAt -twoFASecret -__v")
      .lean();

    if (!user) {
      return NextResponse.json({ 
        error: "User not found" 
      }, { status: 404 });
    }

    console.log("🔍 DEBUG - Fetched user raw data:", {
      id: user._id,
      city: user.city,
      skills: user.skills,
      availabilityTiming: user.availabilityTiming,
      workingHours: user.workingHours,
      email: user.email,
      phone: user.phone,
      countryCode: user.countryCode
    });

    // Format user data for frontend - matches the UPDATE API response structure
    const formattedUser = {
      // Basic Info
      id: user._id.toString(),
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      email: user.email || '',
      
      // Contact Information
      contactNumber: user.countryCode && user.phone 
        ? `${user.countryCode}${user.phone}`
        : '',
      countryCode: user.countryCode || '',
      phone: user.phone || '',
      
      // Location
      city: user.city || '',
      fullAddress: user.fullAddress || '',
      zipCode: user.zipCode || '',
      
      // Profile Details
      username: user.username || '',
      bio: user.bio || '',
      profileImage: user.profileImage || '/d_avatar.png',
      
      // Skills & Work
      skills: user.skills || [],
      hourlyRate: user.hourlyRate || 0,
      rating: user.rating || 0,
      reviewsCount: user.reviewsCount || 0,
      
      // Availability
      availability: user.availability !== undefined ? user.availability : true,
      
      // NEW: Availability Timing (from your schema)
      availabilityTiming: user.availabilityTiming || {
        startWork: "today",
        preferredTime: ["morning", "afternoon", "evening"],
        availableDays: ["monday", "tuesday", "wednesday", "thursday", "friday"]
      },
      
      // NEW: Working Hours (from your schema)
      workingHours: user.workingHours || {
        hoursPerDay: 8,
        daysPerWeek: 5,
        totalHoursPerWeek: 40
      },
      
      // Identity Verification
      identityVerification: user.identityVerification || {
        idType: "CNIC",
        idNumber: "",
        idImageFront: "",
        idImageBack: "",
        status: "pending",
        verifiedAt: null
      },
      
      // Account Details
      role: user.role || 'tasker',
      isVerified: user.isVerified || false,
      isApproved: user.isApproved || false,
      twoFA: user.twoFA || false,
      
      // Additional fields that might be needed
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      
      // Timestamps
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    console.log("✅ DEBUG - Formatted user for frontend:", {
      formattedSkills: formattedUser.skills,
      formattedCity: formattedUser.city,
      formattedAvailabilityTiming: formattedUser.availabilityTiming,
      formattedWorkingHours: formattedUser.workingHours,
      formattedContact: formattedUser.contactNumber
    });

    return NextResponse.json({ 
      user: formattedUser 
    }, { status: 200 });
    
  } catch (error) {
    console.error("❌ Profile fetch error:", error);
    return NextResponse.json({ 
      error: "Failed to load profile data. Please try again." 
    }, { status: 500 });
  }
}