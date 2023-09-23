import { HttpException, HttpStatus, Injectable, Query } from '@nestjs/common';
import { randomUUID } from 'crypto';
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
      console.log(image);
      const imageUploaded = await this.uploader.client
        .upload({
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: Utils.slugfy(
            image.originalname
              .toString()
              .replace(/(.*)(\..*)$/gm, `${randomUUID()}$2`),
          ),
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

  async sendArchives(media: Express.Multer.File, req, queries: any) {
    const clientData = await this.prisma.client.findFirst({
      where: {
        OR: [
          {
            userId: req.userId,
          },
          {
            companiesId: +queries.companieId,
          },
        ],
      },
      include: {
        Companie: true,
      },
    });

    console.log(media, queries);

    if (!clientData && !queries.clientId)
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
              id: +queries.clientId || clientData.Companie.id,
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
