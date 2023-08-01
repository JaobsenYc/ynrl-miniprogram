// page/myhouseholds/index.js
const api = require('./api');
const icon20 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAuCAMAAABgZ9sFAAAAVFBMVEXx8fHMzMzr6+vn5+fv7+/t7e3d3d2+vr7W1tbHx8eysrKdnZ3p6enk5OTR0dG7u7u3t7ejo6PY2Njh4eHf39/T09PExMSvr6+goKCqqqqnp6e4uLgcLY/OAAAAnklEQVRIx+3RSRLDIAxE0QYhAbGZPNu5/z0zrXHiqiz5W72FqhqtVuuXAl3iOV7iPV/iSsAqZa9BS7YOmMXnNNX4TWGxRMn3R6SxRNgy0bzXOW8EBO8SAClsPdB3psqlvG+Lw7ONXg/pTld52BjgSSkA3PV2OOemjIDcZQWgVvONw60q7sIpR38EnHPSMDQ4MjDjLPozhAkGrVbr/z0ANjAF4AcbXmYAAAAASUVORK5CYII=';
Page({
  data: {
    households: [],
    address: [],
    slideButtons: [{
      text: '缴费',
      extClass: 'test',
    }, {
      text: '修改',
    }, {
      type: 'warn',
      text: '删除',
    }],
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
    householdId:'',
    show_customTag: false,
    dialogShow: false,
    edit_dialogShow: false,
    buttons: [{
      text: '取消'
    }, {
      text: '确定'
    }],
  },

  async onLoad() {
    try {
      console.log('开始获取');
      const res_households = await api.getHouseholds();
      if (res_households) {
        this.setData({
          households: res_households,
        });
        for (let household of res_households) {

          await this.getUserAddress(household.householdId);

        }

      } else {
        console.error('API response does not have a "data" field');
      }
    } catch (err) {
      console.log('错误发生');
      console.error(err);
    }
  },
  async getUserAddress(householdId) {

    try {
      const res_data = await api.getUserDetails(householdId);
      console.log('data', res_data)
      const addresses = {
        ...this.data.address
      };
      addresses[householdId] = res_data.address;
      console.log(res_data.address)
      this.setData({
        address:addresses
      });
    } catch (err) {
      console.error(err);
    }
  },

  slideButtonTap(e) {
    const index = e.detail.index; // 获取点击的滑动按钮的索引
    const householdId = e.currentTarget.dataset.householdid; // 获取点击的滑动按钮所属的 householdId
    const buttonInfo = this.data.slideButtons[index]; // 获取点击的滑动按钮的信息
    console.log('Slide button tap - Index:', index);
    console.log('Slide button tap - Household ID:', householdId);
    console.log('Slide button tap - Button Info:', buttonInfo);
    
    if (buttonInfo.text === '缴费') {
        this.copyToClipboard(householdId)
        wx.navigateTo({
            url: '../search/image/index'  // 注意，路径前面要加上 '../' 来表示是相对路径
        })
      } else if (buttonInfo.text === '修改') {
        // 处理修改按钮的逻辑
        this.setData({
            householdId: householdId,
            edit_dialogShow: true
          });
      } else if (buttonInfo.text === '删除') {
        // 处理删除按钮的逻辑
        // ...
        api.deleteHouseholds({
            householdId: householdId,
          });
        wx.showToast({
        title: '户号已删除',
        icon: 'success',
        duration: 1500,
        });
        this.onLoad()
      }
    
        
  },
  onAddTap(e) {
    this.setData({
      dialogShow: true
    });
  },
  copyToClipboard(userId) {

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

  taginputChange(e) {
    this.setData({
      householdTag: e.detail.value,
    });
  },

  idInputChange(e) {
    this.setData({
      householdId: e.detail.value,
    });
  },


  async tapDialogButton(e) {
    if (e.detail.index == 1) {
      try {
        // 获取用户详情
        const userDetails = await api.getUserDetails(this.data.householdId); // 在这里设置真正的userId
        // 检查户号是否存在
        if (!userDetails) {
          // 户号不存在，显示错误提示并退出
          wx.showToast({
            title: '户号不存在',
            icon: 'error',
            duration: 1500,
          });
          return;
        }
  
        // 户号存在，进行保存操作
        await api.saveHouseholds({
          householdId: this.data.householdId,
          tag: this.data.householdTag
        });
        wx.showToast({
          title: '户号已保存',
          icon: 'success',
          duration: 1500,
        });
        this.onLoad()
      } catch (err) {
        wx.showToast({
          title: '操作失败',
          icon: 'error',
          duration: 1500,
        });
      }
    }
  
    this.setData({
      dialogShow: false,
    });
  },

  async tapEditButton(e) {
      console.log("点击了",e.detail)
    if (e.detail.index == 1) {
      try {
        // 获取用户详情
        const userDetails = await api.getUserDetails(this.data.householdId); // 在这里设置真正的userId
        // 检查户号是否存在
        console.log(userDetails)
        if (!userDetails) {
          // 户号不存在，显示错误提示并退出
          wx.showToast({
            title: '户号不存在',
            icon: 'error',
            duration: 1500,
          });
          return;
        }
  
        // 户号存在，进行保存操作
        await api.saveHouseholds({
          householdId: this.data.householdId,
          tag: this.data.householdTag
        });
        wx.showToast({
          title: '户号已保存',
          icon: 'success',
          duration: 1500,
        });
        this.onLoad()
      } catch (err) {
          console.log(err)
        wx.showToast({
          title: '操作失败',
          icon: 'error',
          duration: 1500,
        });
      }
    }
  
    this.setData({
      edit_dialogShow: false,
    });
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