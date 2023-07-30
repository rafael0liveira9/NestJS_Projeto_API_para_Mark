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
          ACL: 'public-read',
          ContentType: image.mimetype,
        })
        .promise();

      return {
        path: `${imageUploaded.Location}`,
      };
    } catch (error: any) {
      console.log(error);
      throw new HttpException(
        {
          Code: HttpStatus.BAD_REQUEST,
          Message: 'Erro ao enviar imagem, tente novamente',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
