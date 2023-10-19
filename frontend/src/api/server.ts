import { CreateServer } from '@wailsApp/go/services/Server';
import { types } from '@wailsApp/go/models';

export function createServer(data: types.CreateServerReq) {
  CreateServer(data).catch(err => {
    console.log(err);
  });
}
