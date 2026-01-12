import { randomUUID } from "crypto";
import cloudinary from "../lib/cloudinary.js";
import { db } from "../lib/db.js";
import { jobApplications } from "../lib/schema.js";
import { desc } from "drizzle-orm";

const uploadBufferToCloudinary = (
  buffer,
  folder = "applications",
  resource_type = "raw",
  access_mode = "public"
) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type, access_mode },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
};

export const createJobApplication = async (req, res, next) => {
  try {
    const { lastName, firstName, email, telephone, position, message } =
      req.body;
    let cvUrl = "";

    if (req.file && req.file.buffer) {
      try {
        const result = await uploadBufferToCloudinary(
          req.file.buffer,
          "applications",
          "auto"
        );
        cvUrl = result.secure_url;
      } catch (err) {
        console.error("Cloudinary upload failed:", err);
        return res.status(500).json({
          error:
            "Erreur lors de l'upload du CV. Vérifiez la configuration Cloudinary.",
        });
      }
    } else {
      return res.status(400).json({ error: "Le CV est requis" });
    }

    const [application] = await db
      .insert(jobApplications)
      .values({
        id: randomUUID(),
        lastName,
        firstName,
        email,
        telephone,
        position: position || "Chef Cuisinier",
        message,
        cvUrl,
      })
      .returning();

    res.status(201).json(application);
  } catch (error) {
    next(error);
  }
};

export const getJobApplications = async (req, res, next) => {
  try {
    const applications = await db
      .select()
      .from(jobApplications)
      .orderBy(desc(jobApplications.createdAt));
    res.json(applications);
  } catch (error) {
    next(error);
  }
};
