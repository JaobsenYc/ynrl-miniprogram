// factory1/components/input-picker/input-picker.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    name: {
      type: String
    },
    casArray: {
      type: Array
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    show: false,
    showMask: false,
    casIndex: [0],
    value: [0],
    selected: '',
    originalCasArray: [],
    filteredCasArray: []
  },

  /**
   * 组件生命周期函数，在组件布局完成后执行
   */
  ready() {

    console.log('初始数据', this.data.casArray);
    this.setData({
      originalCasArray: this.data.casArray,
      filteredCasArray: this.data.casArray
    });

  },
  //解决在页面开始不加载数据的问题
  observers: {
    'casArray': function (newCasArray) {
      // 在 casArray 数组发生变化时，更新 other data
      this.setData({
        originalCasArray: newCasArray,
        filteredCasArray: newCasArray
      });
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindKeyInput(e) {
      const value = e.detail.value;
      const searchResult = this.data.originalCasArray.filter(function (item) {
        return item.text.includes(value);
      });
    
      this.setData({
        filteredCasArray: searchResult,
        selected: searchResult.length > 0 ? searchResult[0] : null,
        value: searchResult.length > 0 ? [0] : this.data.value,
      });
    },
    bindChange(e) {
      const val = e.detail.value;
      if (this.data.filteredCasArray[val[0]]) {
        const selectedValue = this.data.filteredCasArray[val[0]];
        this.setData({
          value: val,
          selected: selectedValue // not selectedValue.text
        });
      } else {
        this.setData({
          value: val,
          selected: null
        });
      }
    },

    submit() {
      this.setData({
        show: false,
        showMask: false,
      });
      if (!this.data.selected) {
        this.setData({
          selected: this.data.casArray.text
        });
      }
      if (!this.data.selected && this.data.filteredCasArray.length > 0) {
        this.setData({
          selected: this.data.filteredCasArray[0]
        });
      }
    
      this.triggerEvent('submit', this.data.selected);
      console.log('结束', this.data.selected); // 这行可以验证 selected 在提交时是否有值
    },

    showPicker() {
      if (this.data.originalCasArray.length > 0 && this.data.filteredCasArray.length === 0) {
        this.setData({
          filteredCasArray: this.data.originalCasArray,
        });
      }

      this.setData({
        show: true,
        showMask: true,
      });
    },
    cancel() {
      this.setData({
        show: false,
        showMask: false,
      });
    },
  }
});