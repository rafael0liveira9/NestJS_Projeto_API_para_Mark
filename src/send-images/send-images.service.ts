import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { UploaderService } from 'src/singleServices/uploader.service';
import { Utils } from 'src/utils/utils';

@Injectable()
export class SendImagesService {
  constructor(private uploader: UploaderService) {}

  async create(image: Express.Multer.File) {
    try {
      let imageUploaded = await this.uploader.client
        .upload({
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: Utils.slugfy(image.originalname),
          Body: image.buffer,
        })
        .promise();

      // if (!!imageUploaded.error) {
      //   throw new HttpException(
      //     {
      //       Code: imageUploaded.error.name,
      //       Message: imageUploaded.error.message,
      //     },
      //     HttpStatus.BAD_REQUEST,
      //   );
      // }

      return {
        path: `${imageUploaded.Location}`,
      };
    } catch (error: any) {
      console.log(error?.Message);
      return error?.Message ?? 'Erro ao enviar foto, tente novamente.';
    }
  }
}
