const Mock = require('mockjs');
const { param2Obj } = require('./utils');

const user = require('./user');
const role = require('./role');
const article = require('./article');
const search = require('./remote-search');
const k8sNamespace = require('./k8s/namespace');
const k8sNode = require('./k8s/node');
const k8sPv = require('./k8s/pv');
const k8sWorkflow = require('./k8s/workflow');
const k8sDeployment = require('./k8s/deployment');
const k8sPod = require('./k8s/pod');
const daemonsetMocks = require('./k8s/daemonset');
const statefulsetMocks = require('./k8s/statefulset');
const k8sIngress = require('./k8s/ingress');
const k8sService = require('./k8s/service');
const k8sConfigMap = require('./k8s/configmap');
const k8sSecret = require('./k8s/secret');
const k8sPersistentVolumeClaim = require('./k8s/persistentvolumeclaim');
// 新增引入
const homeMocks = require('./k8s/home');

const mocks = [
    ...user,
    ...role,
    ...article,
    ...search,
    ...k8sNamespace,
    ...k8sNode,
    ...k8sPv,
    ...k8sWorkflow,
    ...k8sDeployment,
    ...k8sPod,
    ...daemonsetMocks,
    ...statefulsetMocks,
    ...k8sIngress,
    ...k8sService,
    ...k8sConfigMap,
    ...k8sSecret,
    ...k8sPersistentVolumeClaim,
    // 新增添加
    ...homeMocks
];

// for front mock
// please use it cautiously, it will redefine XMLHttpRequest,
// which will cause many of your third-party libraries to be invalidated(like progress event).
function mockXHR() {
  // mock patch
  // https://github.com/nuysoft/Mock/issues/300
  Mock.XHR.prototype.proxy_send = Mock.XHR.prototype.send
  Mock.XHR.prototype.send = function() {
    if (this.custom.xhr) {
      this.custom.xhr.withCredentials = this.withCredentials || false

      if (this.responseType) {
        this.custom.xhr.responseType = this.responseType
      }
    }
    this.proxy_send(...arguments)
  }

  function XHR2ExpressReqWrap(respond) {
    return function(options) {
      let result = null
      if (respond instanceof Function) {
        const { body, type, url } = options
        // https://expressjs.com/en/4x/api.html#req
        result = respond({
          method: type,
          body: JSON.parse(body),
          query: param2Obj(url)
        })
      } else {
        result = respond
      }
      return Mock.mock(result)
    }
  }

  for (const i of mocks) {
    Mock.mock(new RegExp(i.url), i.type || 'get', XHR2ExpressReqWrap(i.response))
  }
}

module.exports = {
  mocks,
  mockXHR
}
