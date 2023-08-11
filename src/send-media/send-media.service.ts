import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/singleServices/prisma.service';

import { UploaderService } from 'src/singleServices/uploader.service';
import { Utils } from 'src/utils/utils';

@Injectable()
export class SendImagesService {
  constructor(
    private uploader: UploaderService,
    private readonly prisma: PrismaService,
  ) {}

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

  async sendArchives(media: Express.Multer.File, req) {
    const clientData = await this.prisma.client.findFirst({
      where: {
        userId: req.userId,
      },
      include: {
        Companie: true,
      },
    });

    if (!clientData)
      throw new HttpException(
        {
          Code: HttpStatus.NOT_FOUND,
          Message: 'Usuário não encontrado',
        },
        HttpStatus.NOT_FOUND,
      );

    const url = (await this.create(media)).path;

    try {
      const archiveData = await this.prisma.archives.create({
        data: {
          url: url,
          companie: {
            connect: {
              id: clientData.Companie.id,
            },
          },
        },
      });

      return archiveData;
    } catch (error: any) {
      console.log(error);
      throw new HttpException(
        {
          Code: HttpStatus.BAD_REQUEST,
          Message: 'Erro ao enviar media, tente novamente',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
