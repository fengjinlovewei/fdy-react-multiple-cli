import { axiosForm, axiosJson } from './axios';
import qs from 'qs';

export const GET_USER_LIST_URL = `/api/getUserList`;
export const GET_NAME_URL = `/api/getName`;
export const LOGIN_URL = `/api/login`;
export const SET_NAME_URL = `/api/setName`;

/**
 *
 */

export function getUserList(data = {}): Promise<UserType[]> {
  return axiosJson({
    method: 'GET',
    url: GET_USER_LIST_URL,
    params: data,
  });
}

export function getName(data = {}) {
  return axiosJson({
    method: 'GET',
    url: GET_NAME_URL,
    params: data,
  });
}

export function login(data = {}) {
  console.log(data);
  return axiosForm({
    method: 'POST',
    url: LOGIN_URL,
    data: qs.stringify(data),
  });
}

// 删除集群
export function setName(data = {}) {
  return axiosForm({
    method: 'POST',
    url: SET_NAME_URL,
    params: data,
  });
}
