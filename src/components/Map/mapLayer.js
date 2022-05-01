/* eslint-disable */
export default {
  data() {
    return {
      carLayer: '',
      lineLayer: '', //两点或多点之间的 连线
      timer: '',
      initLayer: 1,
      mapLayers: [] // 创建的图层列表
    }
  },
  mounted() {},
  //销毁前  关掉 settimeout方法 移除已添加的layer
  beforeDestroy() {
    //关闭 定时器
    clearTimeout(this.timer)
  },
  methods: {
    // 工具
    // 获取对象中的点坐标并返回
    getPointCoordinate(someOption) {
      return [
        parseFloat(someOption.longitude || someOption.x || someOption.X || someOption.JD),
        parseFloat(someOption.latitude || someOption.y || someOption.Y || someOption.WD)
      ]
    },

    //地图打点  -- 图片
    //option 对象
    //map 传递过来的地图
    //path为传递过来的 图片地址
    //list 为 经纬度集合 [x: y:  attr: ,x: y: attr: ]
    //dia 图片大小 默认18  li 为长   wi为宽
    //list中的 attr 需放在点上的内容
    //外加一个判断  是否将其居中显示
    //isCenter 表示 是否将当前层居中  不传时 默认为false
    //layer 表示 当前点所在的层  如果没有则重新建 如有 则直接在该层上放点

    /* 可选
    GraphicsLayerOption: {
      // ATTR <String>className: '' 可选 ( 属性设置为层的节点)
      // ATTR <Number>opacity: 0~1  可选 (透明度)
    }
    */
    creatGraphicsLayer(option) {
      if (option.map && option.list && option.list.length > 0) {
        let gpsLayer = option.layer || esri.layers.GraphicsLayer(option.GraphicsLayerOption)
        option.map.addLayer(gpsLayer)
        let symbol = new esri.symbol.PictureMarkerSymbol(
          option.path,
          option.height || 18,
          option.width || 18
        )

        for (let i = 0; i < option.list.length; i++) {
          let point = new esri.geometry.Point(this.getPointCoordinate(option.list[i]))
          let graphic = new esri.Graphic(point, symbol, option.list[i] || {})
          gpsLayer.add(graphic)
        }
        return gpsLayer
      }
    },

    //点组成的 层级居中显示
    grpaphicLayerIsCenter() {
      alert('功能完善中')
    },

    //生成 播放小车等代表轨迹走向的图标 并调用 轨迹播放方法
    //option 对象
    //map 为地图对象
    //path 轨迹走动的图片路径
    //list 生成轨迹的list集合
    //index 从第几个轨迹点开始运行
    playGps(option) {
      this.carLayer && this.carLayer.clear()
      this.lineLayer && this.lineLayer.clear()
      this.carLayer = new esri.layers.GraphicsLayer('carLayer')
      this.lineLayer = new esri.layers.GraphicsLayer('lineLayer')
      option.map.addLayer(this.carLayer)
      option.map.addLayer(this.lineLayer)
      // 创建符号(图片点)
      const carSymbol = new esri.symbol.PictureMarkerSymbol(
        option.path,
        option.width || 35,
        option.height || 35
      )
      option.carSymbol = carSymbol
      // 创建符号(简单的线)
      const lineSymbol = new esri.symbol.CartographicLineSymbol(
        esri.symbol.CartographicLineSymbol.STYLE_SOLID,
        new esri.Color([65, 105, 225, 255]),
        5,
        esri.symbol.CartographicLineSymbol.CAP_ROUND,
        esri.symbol.CartographicLineSymbol.JOIN_ROUND,
        1
      )
      option.lineSymbol = lineSymbol

      if (option && option.list && option.list.length > 1) {
        this.play(option)
      }
    },
    //轨迹播放  并 将已播放的轨迹练成线
    //option 对象
    //map 地图对象
    //list 轨迹集合
    //index 从第几个轨迹点开始运行
    //path 轨迹走动的图片路径
    //li 轨迹运行对象的 宽  wi 高 默认35
    play(option) {
      if (this.timer) clearTimeout(this.timer)
      // 更新点
      this.forCarByGraphic(option)
      //组合两点 进行连线成轨迹线 并调用 画线方法
      if (option.index >= 1 && option.index < option.list.length) {
        this.forLineByGraphic(option)
      }
      option.index++
      this.timer = setTimeout(() => {
        //将轨迹的两点之间 连成线
        if (option.index < option.list.length) {
          this.play(option)
        }
      }, 500) //500为轨迹走动的 时间间隔 毫秒
    },

    forCarByGraphic(option) {
      this.carLayer && this.carLayer.clear()
      const point = new esri.geometry.Point(this.getPointCoordinate(option.list[option.index]))
      const carGraphic = new esri.Graphic(point, option.carSymbol)
      this.carLayer.add(carGraphic)
    },

    //两点或多个点之间 连成线
    //map 地图 对象
    //list 两个点 或多个点的集合 eg:[[126.xxxx0,103.xxxxx],[126.xxxxxx1,103.xxxxxxx]]
    forLineByGraphic(option) {
      const lineGraphics = [
        this.getPointCoordinate(option.list[option.index]),
        this.getPointCoordinate(option.list[option.index - 1])
      ]
      //轨迹 对应点的 层
      const polylineJson = {
        paths: [lineGraphics],
        spatialReference: { wkid: 4326 }
      }
      const polyline = new esri.geometry.Polyline(polylineJson)
      const lineGraphic = new esri.Graphic(polyline, option.lineSymbol)
      this.lineLayer.add(lineGraphic)
    },

    //放置地图服务到地图上
    //option 对象
    //map 为获取的地图 -- 必传
    //url 为地图服务地址  -- 必传
    //layerId  希望地图服务显示出来的 已知图层 []
    //op 为透明度 不传默认为1 即不透明
    //外加一个判断 是否将其居中显示
    //isCenter 表示中心点的经纬度和 zoom   格式为 {center:[],zoom:10}
    //map,url,layerId,op,isCenter
    //layerShowsWhere {id:,where:'',cover:false} 其中 id  待被选择的图层 where 满足待显示的条件 cover: Boolean 覆盖
    // spareCenter 如果没有x,y坐标居中,使用地图服务备用居中 Boolean
    putMapServerOnMap(option) {
      this.mapLayers[this.initLayer] = new esri.layers.ArcGISDynamicMapServiceLayer(option.url) //ArcGISDynamicMapServiceLayer
      if (option.layerArr && option.layerArr.length > 0) {
        this.mapLayers[this.initLayer].setVisibleLayers(option.layerArr)
      } else if (option.layerId) {
        this.mapLayers[this.initLayer].setVisibleLayers(option.layerId)
      }

      this.mapLayers[this.initLayer].setOpacity(option.op || 1)
      //如果有需要满足条件才显示的 则 放到layerShosWhere 对象里
      if (option.layerShowsWhere?.where) {
        var layerDefinitions = []
        layerDefinitions[option.layerShowsWhere.id] = option.layerShowsWhere.where
        // layerDefinitions[0] = "LQDKDM like '640302%'"
        // layerDefinitions[5]="AREA>100000";
        console.log(layerDefinitions)
        this.mapLayers[this.initLayer].setLayerDefinitions(layerDefinitions)
        // 没有坐标范围,暂时先获取一个点的x,y然后定位(假居中)
        if (option.spareCenter) {
          this.selectMapServerByUrl({
            id: option.layerShowsWhere.id,
            url: option.url,
            where: option.layerShowsWhere.where
          }).then(res => {
            this.setPointZoom(res.features[0].attributes.x, res.features[0].attributes.y, 11)
          })
        }
      }
      //layershowswhere 的 升级版  后面会和  整合  现在没空  2020年12月12日
      if (option.wheresShow && option.wheresShow.length > 0) {
        var layerDefinitions = []
        for (let i = 0; i < option.wheresShow.length; i++) {
          if (option.wheresShow[i].id) {
            layerDefinitions[option.wheresShow[i].id] = option.wheresShow[i].where
          }
        }
        this.mapLayers[this.initLayer].setLayerDefinitions(layerDefinitions)
      }
      if (option.layerShowsWhere?.cover && this.initLayer > 1) {
        option.map.removeLayer(this.mapLayers[this.initLayer - 1])
      }
      option.map.addLayer(this.mapLayers[this.initLayer], option.layer || this.initLayer)
      this.initLayer++
      // //判断isCenter 是否为真 若为真 则将该层居中显示
      if (option.isCenter && option.isCenter.center && option.isCenter.zoom) {
        //已第一个点为中心定位
        let point = new esri.geometry.Point(
          Number(option.isCenter.center[0]),
          Number(option.isCenter.center[1])
        )
        option.map.centerAndZoom(point, zoom || 10)
      }
      return this.mapLayers[this.initLayer - 1]
    },

    /**
     * 按条件查询 地图服务
     * option 对象
     * where条件
     * url 带层级的 url
     * id 待查询的层编码
     *
     * */
    selectMapServerByUrl(option) {
      // option.url = 'http://59.110.28.240:6080/arcgis/rest/services/lqhd/lqdkQBDK/MapServer/0'
      // option.where =
      //   "JYZTLX = '05' and LQDKDM like '640302%'"
      //获取地图服务的的 initialExtent
      return new Promise((resolve, reject) => {
        var queryTask = new esri.tasks.QueryTask(option.url + '/' + option.id)
        var query = new esri.tasks.Query()
        query.where = option.where //查询的where子句

        query.outFields = ['*'] //要包含在FeatureSet中的属性字段。
        query.outSpatialReference = {
          //query参数--返回集合空间的参考
          wkid: option.outSpatialReference || 4326
        }
        query.returnGeometry = true // 如果为“true”，则FeatureSet中的每个要素都包含几何。
        resolve(queryTask.execute(query))
        // queryTask.execute(query).then(fset => {
        //   debugger
        //   // resolve(fset.features)
        //   // return fset.features
        // });
      })
    },

    //地图服务居中的方法
    //option对象 --
    //url 地图服务链接
    //map 地图对象
    //id 表示被筛选的层
    //outSpatialReference : 默认4326   //结论 不同经纬度的地图服务可以添加到地图上 但是 不能居中
    centerMapServer(option) {
      //获取地图服务的的 initialExtent
      var queryTask = new esri.tasks.QueryTask(option.url)
      var query = new esri.tasks.Query()
      query.where = option.where || '' //查询的where子句

      query.outFields = ['*'] //要包含在FeatureSet中的属性字段。
      query.outSpatialReference = {
        //query参数--返回集合空间的参考
        wkid: option.outSpatialReference || 4326
      }
      query.returnGeometry = true // 如果为“true”，则FeatureSet中的每个要素都包含几何。
      queryTask.execute(query).then(fset => {
        let obj = fset.initialExtent || fset.fullExtent
        // let obj = fset.fullExtent;
        let startExtent = new esri.geometry.Extent(
          obj.xmin,
          obj.ymin,
          obj.xmax,
          obj.ymax,
          new esri.SpatialReference({
            wkid: option.outSpatialReference || 4326
          })
        )
        //设置当前地图服务居中
        if (option.autoEnlarge) {
          let panEndEvent = option.map.on('pan-end', event => {
            option.map.setZoom(option.scale || 3)
            panEndEvent.remove()
            zoomEndEvent.remove()
          })
          let zoomEndEvent = option.map.on('zoom-end', event => {
            option.map.setZoom(option.scale || 3)
            panEndEvent.remove()
            zoomEndEvent.remove()
          })
        }
        option.map.setExtent(startExtent)
      })
    },

    //获取地图服务上的信息  异步方法 需要 做一个 调用完成后 回调 将获取到的信息返回
    /* --- WARNING注意：IdentifyTask,IdentifyParameters 需要 加载地图模板（loadModules）时添加 方可正常使用 不然报 underfined*/
    //option 对象
    //参数说明：
    // map;为获取的地图 -- 必传
    //event为点击地图时 返回的对象 --必传
    //plantUrl 为待查询的 地图服务地址 eg:'http://59.110.28.240:6080/arcgis/rest/services/YZT/dkPlant1/MapServer' --必传
    //dataIds 为待查询的 图层编码集合 为array 数组类型 eg：[88]
    //map,event,plantUrl,dataIds
    getMapServerMessage(option) {
      return new Promise((resolve, reject) => {
        /* 你的逻辑代码 */
        var identifyTask = new esri.tasks.IdentifyTask(option.plantUrl)
        var identifyParameters = new esri.tasks.IdentifyParameters()
        identifyParameters.tolerance = 0.0000000001
        identifyParameters.returnGeometry = true
        identifyParameters.layerIds = option.dataIds || []
        identifyParameters.layerOption = esri.tasks.IdentifyParameters.LAYER_OPTION_ALL
        identifyParameters.geometry = option.event.mapPoint
        identifyParameters.mapExtent = option.map.extent
        identifyTask.execute(identifyParameters, function(iset) {
          //将获取到的信息返回
          resolve(iset)
        })
      })
    },
    //一般和上方查询 地图服务属性值的方法配套使用
    //点击区域高亮  --- 块儿时
    //option 对象
    //map 地图对象
    //feature 点击地图获取到的feature对象
    setRedEdge(option) {
      let redEdgeLayer = esri.layers.GraphicsLayer('redEdgeLayer')
      option.map.addLayer(redEdgeLayer)

      var symbol = new esri.symbol.SimpleLineSymbol(
        esri.symbol.SimpleLineSymbol.STYLE_SOLID,
        new dojo.Color(option.colors || [255, 0, 0]),
        3
      )

      //将生成的symple放到feature里
      option.feature.setSymbol(symbol)
      //将feature 安置到map中
      var dbx_json = option.feature.geometry.toJson()
      var polygonJson = {
        rings: dbx_json.rings,
        spatialReference: dbx_json.spatialReference
      }
      var polygon = new esri.geometry.Polygon(polygonJson)
      var graphic = new esri.Graphic(
        polygon,
        symbol,
        option.feature.attributes,
        option.feature.infoTemplate
      )
      // option.map.graphics.add(graphic);
      redEdgeLayer.add(graphic)
      return redEdgeLayer
    },

    /**
     *  绘制线
     *  map 地图对象
     *
     *  */
    createPolyline(map, geometryEngine, list, mapPointList, item, layer) {
      if (!layer) {
        layer = esri.layers.GraphicsLayer('lineLayer')
        map.addLayer(layer)
      }
      //如果item真 则开始测距
      let engine = 0
      if (item) {
        var polylineJsons = { paths: [list], spatialReference: { wkid: 4326 } }
        var polylines = new esri.geometry.Polyline(polylineJsons)
        // let engine = esri.geometry.geometryEngine
        //[polygon],esri.Units.SQUARE_METERS
        engine = geometryEngine.geodesicLength(polylines, 'meters')
      }
      var symbol = new esri.symbol.SimpleLineSymbol(
        esri.symbol.SimpleLineSymbol.STYLE_SOLID,
        new dojo.Color([255, 255, 255]),
        3
      )
      var polylineJson = {
        paths: [list],
        spatialReference: { wkid: 4326 }
      }
      var polyline = new esri.geometry.Polyline(polylineJson)
      var graphic = new esri.Graphic(polyline, symbol)
      layer.add(graphic)
      //将获取的数据 放到 多边形中间
      if (item) {
        let center = new esri.geometry.Point(list[0], list[1])
        // let center = polyline.getExtent().getCenter()
        let option = {
          map: map,
          center: center,
          text: engine.toFixed(2) + '米',
          layer: layer
        }
        this.putTextOnMap(option)
      }

      return layer
      // map.graphics.add(graphic)
    },

    /*特殊说明：绘制线和 绘制面可共用一个方法 根据 参数不同去具体判断*/

    /**
     * //绘制多边形 并测距
     * map 地图对象
     * geometryEngine 地图加载时 生成的并传递过来的
     * list 表示点击地图获取的 屏幕坐标集合
     * mapPointList 表示由屏幕坐标 转为的 地图坐标
     * item 表示是否需要 计算绘制的多边形的面积 如果不传 则默认为false 则只绘制 多边形
     * 后面 传递 多边形的颜色 和宽度等 、计算面积的 单位等 先按下
     * */
    createPolygon(map, geometryEngine, list, mapPointList, item, layer) {
      if (!layer) {
        layer = esri.layers.GraphicsLayer('lineLayer')
        map.addLayer(layer)
      }
      // 多边形的颜色
      var symbol = new esri.symbol.SimpleLineSymbol(
        esri.symbol.SimpleLineSymbol.STYLE_SOLID,
        new dojo.Color([255, 255, 255]),
        3
      )
      //如果item真 则开始凉面
      let engine = 0
      if (item) {
        var polygonJson = { rings: [list], spatialReference: { wkid: 4326 } }
        var polygon = new esri.geometry.Polygon(polygonJson)
        // let engine = esri.geometry.geometryEngine
        //[polygon],esri.Units.SQUARE_METERS
        engine = geometryEngine.geodesicArea(polygon, 'square-meters')
      }
      var polygonJsons = { rings: [list], spatialReference: { wkid: 4326 } }
      var polygons = new esri.geometry.Polygon(polygonJsons)
      //将获取的数据 放到 多边形中间
      if (item) {
        let center = polygons.getExtent().getCenter()
        let option = {
          map: map,
          center: center,
          text: this.validate(engine.toFixed(2)) + '平方米',
          layer: layer
        }
        this.putTextOnMap(option)
      }
      var graphic = new esri.Graphic(polygons, symbol)
      layer.add(graphic)
      return layer
      //  map.graphics.add(graphic)
      // return graphic
    },

    //判断是否为正数
    validate(num) {
      var reg = /^\d+(?=\.{0,1}\d+$|$)/
      if (reg.test(num)) return num

      return num * -1
    },

    /**
     *  //放文字到地图上
     *  option 对象
     *  text 放在地图上的文字
     *  center 中心点组成的point
     *  map 地图对象
     *  layer 文字所在的layer层
     *  后面会完善譬如 传递 字体大小 字体颜色 文字上放的 内容 等
     **/
    putTextOnMap(option) {
      if (!option.layer) {
        option.layer = esri.layers.GraphicsLayer('textLayer')
        option.map.addLayer(option.layer)
      }
      let font = new esri.symbol.Font(
        '24px',
        esri.symbol.Font.STYLE_NORMAL,
        esri.symbol.Font.WEIGHT_BOLD,
        esri.symbol.Font.WEIGHT_BOLDER
      )
      let textSymbol = new esri.symbol.TextSymbol(
        option.text,
        font,
        new esri.Color([255, 255, 255])
      )
      var labelPointGraphic = new esri.Graphic(option.center, textSymbol, '')
      option.layer.add(labelPointGraphic)
      // option.map.graphics.add(labelPointGraphic);
    },

    /**
     *
     * 屏幕坐标转 地图坐标
     * option 对象
     *  map 地图对象
     * [,] //经纬度集合
     **/
    screenToMap(option) {
      let changePoint = new esri.geometry.Point(option.list[0], option.list[1])
      return option.map.toMap(changePoint)
    },

    /*将json 串转化为 geometry*/
    fromJsonForGeometry(geometry, map) {
      map.setExtent(geometry.getExtent())
    },

    // 根据geometry 获取 center 并将文字放到 地图上
    putTextByGeometry(geometry, map, text, layer) {
      let center = geometry.getExtent().getCenter()
      let option = {
        map: map,
        center: center,
        text: text,
        layer: layer
      }
      this.putTextOnMap(option)
    },

    //放大到指定的坐标和层级
    setPointZoom(x, y, zoom) {
      let mapPoint = new esri.geometry.Point(parseFloat(x), parseFloat(y))
      return this.map.centerAndZoom(mapPoint, zoom)
    },

    // 放大到指定坐标和层级且维持在大层级以内
    setPointDynamicZoom(x, y, zoom) {
      let mapPoint = new esri.geometry.Point(parseFloat(x), parseFloat(y))
      return this.map.getZoom() > zoom
        ? this.map.centerAndZoom(mapPoint, this.map.getZoom())
        : this.map.centerAndZoom(mapPoint, zoom)
    }
  }
}
