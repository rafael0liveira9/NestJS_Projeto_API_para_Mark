import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
  public signJwt({
    id,
    userId,
    roleType,
  }: {
    id: number;
    userId: number;
    roleType: number;
  }) {
    return jwt.sign({ id, userId, roleType }, process.env.SECRET, {
      expiresIn: 86400,
    });
  }

  public async readJwt({ token }: { token: string }): Promise<{
    id: number;
    userId: number;
    roleType: number;
  }> {
    let decodedData: {
      id: number;
      userId: number;
      roleType: number;
    };

    jwt.verify(
      token,
      process.env.SECRET,
      async (
        err,
        decoded: {
          id: number;
          userId: number;
          roleType: number;
        },
      ) => {
        if (err) {
          return Error();
        } else {
          decodedData = decoded;
        }
      },
    );

    return decodedData;
  }
}

/* 
jwt.sign(
            {
              id: clientData.id,
              userId: clientData.User.id,
              roleType: clientData.User.roleTypeId,
            },
            process.env.SECRET,
            {
              expiresIn: 86400,
            },
          )

*/
