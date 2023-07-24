const api = require('./api');

Page({
  data: {
    theme: 'light',
    users: {
    },
    dialog_show: false,
    show: false,
    selected: {
      community: null,
      building: null,
      unit: null,
      floor: null,
      room: null,
    },
    communities: [],
    buildings: [],
    units: [],
    floors: [],
    rooms: [],
    filteredCommunities: [],
  },

  async onLoad() {
    try {
      const communities = await api.getCommunities();
      this.setData({
        communities: communities,
        filteredCommunities: communities
      });
    } catch (err) {
      console.error(err);
    }
  },

  inputEvent(e) {
    const key = e.detail.value;
    const searchResults = this.data.communities.filter(item => item.text.includes(key));
    this.setData({
      searchResults
    });
  },

  async selectCommunity(e) {
    const selectedCommunity = e.detail;
    this.resetSelection();
    this.setData({
      'selected.community': selectedCommunity,
    });
    await this.loadData('buildings', this.data.selected.community.id);
  },

  async bindBuildingChange(e) {
    const indexBuilding = e.detail.value;
    this.resetSelection('unit', 'floor', 'room');
    this.setData({
      'selected.building': indexBuilding,
    });
    await this.loadData('units', this.data.selected.community.id, this.data.buildings[this.data.selected.building]);
  },

  async bindUnitChange(e) {
    const indexUnit = e.detail.value;
    this.resetSelection('floor', 'room');
    this.setData({
      'selected.unit': indexUnit,
    });
    await this.loadData('floors', this.data.selected.community.id, this.data.buildings[this.data.selected.building], this.data.units[this.data.selected.unit]);
  },

  async bindFloorChange(e) {
    const indexFloor = e.detail.value;
    this.resetSelection('room');
    this.setData({
      'selected.floor': indexFloor,
    });
    await this.loadData('rooms', this.data.selected.community.id, this.data.buildings[this.data.selected.building], this.data.units[this.data.selected.unit], this.data.floors[this.data.selected.floor]);
  },

  bindRoomChange(e) {
    const indexRoom = e.detail.value;
    this.setData({
      'selected.room': indexRoom,
    });
    this.onQueryUsers();
  },

  async loadData(type, ...args) {
    try {
      let data;
      switch (type) {
        case 'buildings':
          data = await api.getBuildings(...args);
          this.setData({
            buildings: data
          });
          break;
        case 'units':
          data = await api.getUnits(...args);
          this.setData({
            units: data
          });
          break;
        case 'floors':
          data = await api.getFloors(...args);
          this.setData({
            floors: data
          });
          break;
        case 'rooms':
          data = await api.getRooms(...args);
          this.setData({
            rooms: data
          });
          break;

        default:
          break;
      }
    } catch (err) {
      console.error(`Error getting ${type}:`, err);
      switch (type) {
        case 'buildings':
          this.setData({
            buildings: []
          });
          break;
        case 'units':
          this.setData({
            units: []
          });
          break;
        case 'floors':
          this.setData({
            floors: []
          });
          break;
        case 'rooms':
          this.setData({
            rooms: []
          });
          break;
        default:
          break;
      }
    }
  },

  resetSelection(...fields) {
    const resetData = {};
    fields.forEach(field => {
      resetData[`selected.${field}`] = null;
    });
    this.setData(resetData);
  },

  async onQueryUsers() {
    const {
      community,
      building,
      unit,
      floor,
      room
    } = this.data.selected;
    if (
      community === null ||
      building === null ||
      unit === null ||
      floor === null ||
      room === null
    ) {
      wx.showToast({
        title: '请选择完整的信息',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    const buildingId = this.data.buildings[building];
    const unitId = this.data.units[unit];
    const floorId = this.data.floors[floor];
    const roomId = this.data.rooms[room];

    try {
      const users = await api.getUsers(
        community.id,
        buildingId,
        unitId,
        floorId,
        roomId
      );
      this.setData({
        users,
      });
      console.log(users);
    } catch (err) {
      console.error("Error getting users:", err);
      this.setData({
        users: []
      });
    }
  },
  open() {
    this.setData({
      dialog_show: true
    })
    console.log(this.data.users.address);
  },
  copyToClipboard(e) {
    const userId = this.data.users.userId;
  
    const showFailToast = function() {
      wx.showToast({
        title: '复制失败',
        icon: 'none',
        duration: 1500,
      });
    };
  
    wx.setClipboardData({
      data: userId,
      success(res) {
        wx.getClipboardData({
          success(res) {
            wx.showToast({
              title: '户号已复制',
              icon: 'success',
              duration: 1500,
            });
          },
          fail: showFailToast,
        });
      },
      fail: showFailToast,
    });
  },

  hidePartOfName(realname) {
    if (!realname) return "";
    const length = realname.length;
    if (length <= 1) {
      return "*";
    } else if (length === 2) {
      return realname.substring(0, 1) + "*";
    } else {
      let newName = realname.substring(0, 1);
      for (let i = 1; i < length - 1; i++) {
        newName += "*";
      }
      newName += realname.substring(length - 1, length);
      return newName;
    }
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})