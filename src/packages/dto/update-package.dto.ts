import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePackageDto } from './create-package.dto';

export class UpdatePackageDto extends PartialType(CreatePackageDto) {
  @ApiProperty()
  id: number;
  @ApiProperty()
  servicesUp: ServiceData[];
}

class ServiceData {
  id?: number;
  service: number;
}

/* 
[
    {
        "id": 4,
        "packageId": 5,
        "serviceId": 4,
        "Service": {
            "id": 4,
            "name": "Serviço",
            "price": 41242.13,
            "description": "Teste",
            "createdAt": "2023-06-07T01:05:22.384Z",
            "updatedAt": "2023-07-22T17:50:22.691Z",
            "deletedAt": "2023-07-22T18:01:23.275Z",
            "serviceTypeId": 3,
            "ServiceType": {
                "id": 3,
                "name": "Social"
            }
        },
        "name": "Serviço",
        "price": 41242.13,
        "description": "Teste",
        "createdAt": "2023-06-07T01:05:22.384Z",
        "updatedAt": "2023-07-22T17:50:22.691Z",
        "deletedAt": "2023-07-22T18:01:23.275Z",
        "serviceTypeId": 3,
        "ServiceType": {
            "id": 3,
            "name": "Social"
        },
        "label": "Serviço",
        "value": 4
    }
]

*/
