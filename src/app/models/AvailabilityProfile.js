// import { Schema, model, models } from "mongoose";

// const pointSchema = new Schema({
//   type: { type: String, enum: ["Point"], default: "Point" },
//   coordinates: { type: [Number], default: [0, 0] } // [lng, lat]
// });

// const AvailabilityProfileSchema = new Schema(
//   {
//     user: { type: Schema.Types.ObjectId, ref: "User", required: true },
//     fullAddress: { type: String, trim: true, default: "" },
//     city: { type: String, trim: true, default: "" },
//     location: { type: pointSchema, default: { type: "Point", coordinates: [0, 0] }, index: "2dsphere" },
//     workScope: { type: [{ type: String }], default: [] },
//     workDays: { type: [{ type: String }], default: [] },
//     workDetails: { type: String, trim: true, maxlength: 500, default: "" },
//     skill: { type: String, trim: true, default: "" },
//   },
//   { timestamps: true }
// );

// const AvailabilityProfile = models.AvailabilityProfile || model("AvailabilityProfile", AvailabilityProfileSchema);
// export default AvailabilityProfile;
