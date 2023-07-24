import CustomPage from '../../../base/CustomPage'

CustomPage({
  onShareAppMessage() {
    return {
      title: 'searchbar',
      path: 'page/weui/example/searchbar/searchbar'
    }
  },
  data: {
    inputShowed: false,
    inputVal: '',
    communities: [{
      "id": "0001",
      "text": "金水湾"
    }, {
      "id": "0002",
      "text": "邺都华府"
    }, {
      "id": "0003",
      "text": "天鹅湾"
    }, {
      "id": "0004",
      "text": "城市之星A区"
    }, {
      "id": "0005",
      "text": "城市之星B区"
    }, {
      "id": "0006",
      "text": "城市之星C区"
    }, {
      "id": "0007",
      "text": "城市之星D区"
    }, {
      "id": "0008",
      "text": "城市花园"
    }, {
      "id": "0009",
      "text": "凤凰城一期"
    }, {
      "id": "0010",
      "text": "润泽园一二期"
    }, {
      "id": "0011",
      "text": "润泽园三期"
    }, {
      "id": "0012",
      "text": "银街一号"
    }, {
      "id": "0013",
      "text": "幸福苑廉租房"
    }, {
      "id": "0014",
      "text": "永宁花园"
    }, {
      "id": "0015",
      "text": "兴邺花园"
    }, {
      "id": "0016",
      "text": "建邺一期"
    }, {
      "id": "0017",
      "text": "金凤名苑"
    }, {
      "id": "0018",
      "text": "邺邸怡苑"
    }, {
      "id": "0019",
      "text": "祥和园"
    }, {
      "id": "0020",
      "text": "锦江花园"
    }, {
      "id": "0021",
      "text": "银河小区"
    }, {
      "id": "0022",
      "text": "人大小区"
    }, {
      "id": "0023",
      "text": "金凤嘉园"
    }, {
      "id": "0024",
      "text": "邺都花园"
    }, {
      "id": "0025",
      "text": "财政新区"
    }, {
      "id": "0026",
      "text": "佳恒花园"
    }, {
      "id": "0027",
      "text": "名仕达二期"
    }, {
      "id": "0028",
      "text": "名仕达一期"
    }, {
      "id": "0029",
      "text": "锦江新城西区"
    }, {
      "id": "0030",
      "text": "财政局家属院"
    }, {
      "id": "0031",
      "text": "临漳镇信用社家属院"
    }, {
      "id": "0032",
      "text": "交警队家属院"
    }, {
      "id": "0033",
      "text": "鑫鑫嘉园"
    }, {
      "id": "0034",
      "text": "老粮局家属院"
    }, {
      "id": "0035",
      "text": "邺新小区"
    }, {
      "id": "0036",
      "text": "人保后两排"
    }, {
      "id": "0037",
      "text": "恒泰苑（电力局小区）"
    }, {
      "id": "0038",
      "text": "铜雀丽苑"
    }, {
      "id": "0039",
      "text": "盛世阳光"
    }, {
      "id": "0040",
      "text": "远邦公馆一期"
    }, {
      "id": "0041",
      "text": "书香佳苑二期"
    }, {
      "id": "0042",
      "text": "名仕达三期"
    }, {
      "id": "0043",
      "text": "名仕达五期"
    }, {
      "id": "0044",
      "text": "城市新星一期"
    }, {
      "id": "0045",
      "text": "凤凰城二期"
    }, {
      "id": "0046",
      "text": "天轩湖畔"
    }, {
      "id": "0047",
      "text": "幸福苑公租房"
    }, {
      "id": "0048",
      "text": "润泽园公租房"
    }, {
      "id": "0049",
      "text": "城市新星二期"
    }, {
      "id": "0050",
      "text": "春华新府"
    }, {
      "id": "0051",
      "text": "盛世家园二期"
    }, {
      "id": "0052",
      "text": "星河湾"
    }, {
      "id": "0053",
      "text": "金凤龙城"
    }, {
      "id": "0054",
      "text": "龙祥苑"
    }, {
      "id": "0055",
      "text": "城市花园二期"
    }, {
      "id": "0056",
      "text": "祥和苑二期"
    }, {
      "id": "0057",
      "text": "远邦公馆二期"
    }, {
      "id": "0058",
      "text": "桃源林语"
    }, {
      "id": "0059",
      "text": "富康新城C区"
    }], 
  },
  onLoad() {
    this.setData({
      search: this.search.bind(this)
    })
  },
  search(value) {
    return new Promise((resolve) => {
      const filteredCommunities = this.data.communities.filter(community =>
        community.text.includes(value)
      );
      resolve(filteredCommunities);
    })
  },
  selectResult(e) {
    const selectedCommunity = e.detail;
    console.log('select result', selectedCommunity);
  },
})
