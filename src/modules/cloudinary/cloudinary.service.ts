// src/cloudinary/cloudinary.service.ts
import { Injectable } from '@nestjs/common';
import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from 'cloudinary';

@Injectable()
export class CloudinaryService {
  /**
   * Upload ảnh lên Cloudinary
   * @param file - File từ multer
   * @param folder - Folder trên Cloudinary (vd: "products")
   * @returns { publicId, secureUrl }
   */
  async uploadImage(
    file: Express.Multer.File,
    folder: string = 'products',
  ): Promise<{ publicId: string; secureUrl: string }> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder, // products/
          resource_type: 'image',
          transformation: [
            { width: 800, height: 800, crop: 'limit' }, // Resize max 800x800
            { quality: 'auto' }, // Auto quality
            { fetch_format: 'auto' }, // Auto format (WebP nếu browser support)
          ],
        },
        (error: UploadApiErrorResponse, result: UploadApiResponse) => {
          if (error) return reject(error);

          resolve({
            publicId: result.public_id,
            secureUrl: result.secure_url,
          });
        },
      );

      // Pipe file buffer vào Cloudinary stream
      uploadStream.end(file.buffer);
    });
  }

  /**
   * Xóa ảnh khỏi Cloudinary
   * @param publicId - Public ID của ảnh
   */
  async deleteImage(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Error deleting image from Cloudinary:', error);
      throw error;
    }
  }

  /**
   * Update ảnh (xóa ảnh cũ, upload ảnh mới)
   */
  async replaceImage(
    oldPublicId: string,
    newFile: Express.Multer.File,
    folder: string = 'products',
  ): Promise<{ publicId: string; secureUrl: string }> {
    // Xóa ảnh cũ
    if (oldPublicId) {
      await this.deleteImage(oldPublicId);
    }

    // Upload ảnh mới
    return this.uploadImage(newFile, folder);
  }
}
