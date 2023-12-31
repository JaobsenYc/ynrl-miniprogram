// query/api.js

// Make sure to update the cloud environment ID based on your actual setup
const envId = 'prod-2ggzau6r9a169f02';

function callContainerApi(params, retries = 5) {
  return new Promise((resolve, reject) => {
    const attempt = () => {
      wx.cloud.callContainer({
        config: {
          env: envId,
        },
        ...params,
        header: {
          'X-WX-SERVICE': 'koa-l2vl', // xxx中填入服务名称（微信云托管 - 服务管理 - 服务列表 - 服务名称）
          // 其他header参数
        },
        success(res) {
          if (res.statusCode === 200 || res.statusCode === 201) {
            resolve(res.data);
          } else {
            reject(new Error(`请求失败，状态码：${res.statusCode}`));
          }
        },
        fail(err) {
          if (retries > 0) {
            retries--;
            wx.showToast({
              title: '请求失败，正在重试...',
              icon: 'none',
            });
            attempt();
          } else {
            wx.showToast({
              title: '请求失败，请检查网络后重试',
              icon: 'none',
            });
            reject(err);
          }
        },
      });
    };

    attempt();
  });
}


function getCommunities() {
  return callContainerApi({
    path: '/api/communities',
    method: 'GET',
  });
}

function getBuildings(communityId) {
  return callContainerApi({
    path: `/api/communities/${communityId}/buildings`,
    method: 'GET',
  });
}



function getUnits(communityId, buildingId) {
  return callContainerApi({
    path: `/api/communities/${encodeURIComponent(communityId)}/buildings/${encodeURIComponent(buildingId)}/units`,
    method: 'GET',
  });
}

function getFloors(communityId, buildingId, unitId) {
  return callContainerApi({
    path: `/api/communities/${encodeURIComponent(communityId)}/buildings/${encodeURIComponent(buildingId)}/units/${encodeURIComponent(unitId)}/floors`,
    method: 'GET',
  });
}

function getRooms(communityId, buildingId, unitId, floorId) {
  return callContainerApi({
    path: `/api/communities/${encodeURIComponent(communityId)}/buildings/${encodeURIComponent(buildingId)}/units/${encodeURIComponent(unitId)}/floors/${encodeURIComponent(floorId)}/rooms`,
    method: 'GET',
  });
}

function getUsers(communityId, buildingId, unitId, floorId, roomId) {
  return callContainerApi({
    path: `/api/communities/${encodeURIComponent(communityId)}/buildings/${encodeURIComponent(buildingId)}/units/${encodeURIComponent(unitId)}/floors/${encodeURIComponent(floorId)}/rooms/${encodeURIComponent(roomId)}/users`,
    method: 'GET',
  });
}


function getUserDetails(userId) {
  return callContainerApi({
    path: `/api/users/${userId}/details`,
    method: 'GET',
  });
}

function saveHouseholds(data) {
  return callContainerApi({
    path: '/api/users/households',
    method: 'POST',
    data
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
  saveHouseholds
};
