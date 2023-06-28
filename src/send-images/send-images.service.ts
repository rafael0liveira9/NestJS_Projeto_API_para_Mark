import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSendImageDto } from './dto/create-send-image.dto';
import { UpdateSendImageDto } from './dto/update-send-image.dto';
import { UploaderService } from 'src/singleServices/uploader.service';
import { Utils } from 'src/utils/utils';

@Injectable()
export class SendImagesService {
  constructor(private uploader: UploaderService) {}

  async create(image: Express.Multer.File) {
    try {
      let imageUploaded = await this.uploader.client
        .from('testebucket')
        .upload(Utils.slugfy(image.originalname), image.buffer, {
          contentType: image.mimetype,
        });

      if (!!imageUploaded.error) {
        throw new HttpException(
          {
            Code: imageUploaded.error.name,
            Message: imageUploaded.error.message,
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      return {
        path: `${process.env.STORAGE_BASEURL}${imageUploaded.data.path}`,
      };
    } catch (error: any) {
      console.log(error?.Message);
      return error?.Message ?? 'Erro ao enviar foto, tente novamente.';
    }
  }
}
