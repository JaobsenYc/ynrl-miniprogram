// query/api.js

// Make sure to update the cloud environment ID based on your actual setup
const envId = 'prod-3g90nuqn137592b4';

function callContainerApi(params) {
  return new Promise((resolve, reject) => {
    wx.cloud.callContainer({
      config: {
        env: envId,
      },
      ...params,
      header: {
        'X-WX-SERVICE': 'koa-m57w', // xxx中填入服务名称（微信云托管 - 服务管理 - 服务列表 - 服务名称）
        // 其他header参数
      },
      success(res) {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(new Error(`请求失败，状态码：${res.statusCode}`));
        }
      },
      fail(err) {
        reject(err);
      },
    });
  });
}

function getCommunities() {
  return callContainerApi({
    path: '/communities',
    method: 'GET',
  });
}

function getBuildings(communityId) {
  return callContainerApi({
    path: `/communities/${communityId}/buildings`,
    method: 'GET',
  });
}

function getUnits(communityId, buildingId) {
  return callContainerApi({
    path: `/communities/${communityId}/buildings/${buildingId}/units`,
    method: 'GET',
  });
}

function getFloors(communityId, buildingId, unitId) {
  return callContainerApi({
    path: `/communities/${communityId}/buildings/${buildingId}/units/${unitId}/floors`,
    method: 'GET',
  });
}

function getRooms(communityId, buildingId, unitId, floorId) {
  return callContainerApi({
    path: `/communities/${communityId}/buildings/${buildingId}/units/${unitId}/floors/${floorId}/rooms`,
    method: 'GET',
  });
}

function getUsers(communityId, buildingId, unitId, floorId, roomId) {
  return callContainerApi({
    path: `/communities/${communityId}/buildings/${buildingId}/units/${unitId}/floors/${floorId}/rooms/${roomId}/users`,
    method: 'GET',
  });
}

function getUserDetails(userId) {
  return callContainerApi({
    path: `/users/${userId}/details`,
    method: 'GET',
  });
}

module.exports = {
  getCommunities,
  getBuildings,
  getUnits,
  getFloors,
  getRooms,
  getUsers,
  getUserDetails,
};
