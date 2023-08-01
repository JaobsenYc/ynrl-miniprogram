const api = require('./api');

Page({
  data: {
    theme: 'light',
    users: {},
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
    isInformationComplete: false,
    radioItems: [{
        name: '我家',
        value: '我家',
        checked: 'true'
      },
      {
        name: '父母',
        value: '父母'
      },
      {
        name: '房东',
        value: '房东'
      },
      {
        name: '其他',
        value: '其他'
      },
    ],
    householdTag: '我家',
    show_customTag: false,
    buttons: [{
      text: '取消'
    }, {
      text: '确定'
    }],
    dialogShow: false,
    isBuildingPickerDisabled: true,
    isUnitPickerDisabled: true,
    isFloorPickerDisabled: true,
    isRoomPickerDisabled: true,
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
    this.resetSelection('building', 'unit', 'floor', 'room');
    this.setData({
      'selected.community': selectedCommunity,
      'isInformationComplete': false
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
      'isInformationComplete': true
    });
    this.onQueryUsers();
  },
  sortData(data) {

    return data.sort((a, b) => a - b);
  },

  async loadData(type, ...args) {
    try {
      let data;
      switch (type) {
        case 'buildings':
          data = await api.getBuildings(...args);
          data = this.sortData(data);
          this.setData({
            buildings: data,
            isBuildingPickerDisabled: false,
          });
          break;
        case 'units':
          data = await api.getUnits(...args);
          data = this.sortData(data);
          this.setData({
            units: data,
            isUnitPickerDisabled: false,
          });
          break;
        case 'floors':
          data = await api.getFloors(...args);
          data = this.sortData(data);
          this.setData({
            floors: data,
            isFloorPickerDisabled: false,
          });
          break;
        case 'rooms':
          data = await api.getRooms(...args);
          data = this.sortData(data);
          this.setData({
            rooms: data,
            isRoomPickerDisabled: false,
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

    if (this.data.isInformationComplete) {
      this.setData({
        dialog_show: true
      })

    } else {
      wx.showToast({
        title: '请选择完整信息',
        icon: 'error',
        duration: 2000
      });
    }

    console.log(this.data.users.address);
  },
  copyToClipboard(e) {
    const userId = this.data.users.userId;

    const showFailToast = function () {
      wx.showToast({
        title: '复制失败',
        icon: 'error',
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

  showSaveHousehold(e) {
    this.setData({
      dialogShow: true,
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

  radioChange: function (e) {
    let radioItems = this.data.radioItems;
    let checkedValue = e.detail.value;
    let show_customTag = this.data.show_customTag;
    for (let i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == checkedValue;
      if (radioItems[i].checked && radioItems[i].value === "其他") {
        show_customTag = true; // 如果选项为其他，则显示输入框
      } else if (radioItems[i].checked) {
        show_customTag = false; // 如果选项不是其他，则隐藏输入框
      }
    }
    this.setData({
      radioItems: radioItems,
      householdTag: checkedValue,
      show_customTag: show_customTag
    });

  },

  inputChange(e) {
    this.setData({
      householdTag: e.detail.value,
    });
  },
  async tapDialogButton(e) {
    if (e.detail.index == 1) {
      await api.saveHouseholds({
        householdId: this.data.users.userId,
        tag: this.data.householdTag
      }).then(res => {
        wx.showToast({
          title: '户号已保存',
          icon: 'success',
          duration: 1500,
        });
      }).catch(err => {
        wx.showToast({
          title: '户号保存失败',
          icon: 'error',
          duration: 1500,
        });
      });
    }
    console.log(this.data.householdTag)
    this.setData({
      dialogShow: false,
    })
  },

  goTopay(e) {
    this.copyToClipboard()
    wx.navigateTo({
      url: 'image/index'  // 注意，路径前面要加上 '../' 来表示是相对路径
    })
    

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