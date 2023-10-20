import { CreateGroups, CreateServer, GetGroups, GetServers } from '@wailsApp/go/services/Server';
import { types } from '@wailsApp/go/models';
import toast from 'react-hot-toast';

export async function createServer(data: types.ServerReq): Promise<void> {
  try {
    await CreateServer(data);
    toast.success('添加新服务器成功');
  } catch (err) {
    toast.error(`添加服务器失败${err}`);
    throw err;
  }
}

export async function getServers(): Promise<types.ServersResp> {
  try {
    return await GetServers();
  } catch (err) {
    throw err;
  }
}

export async function createGroup(data: types.GroupReq): Promise<void> {
  try {
    await CreateGroups(data);
    toast.success('添加新分组成功');
  } catch (err) {
    toast.error(`添加分组失败${err}`);
    throw err;
  }
}

export async function getGroups(): Promise<types.GroupsResp> {
  try {
    return await GetGroups();
  } catch (err) {
    throw err;
  }
}
