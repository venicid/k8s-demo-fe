const Mock = require('mockjs');

// 生成模拟 Namespace 数据
const List = [];
const count = 10; // 生成 10 条模拟数据

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    metadata: {
      name: '@word',
      labels: {
        "app": "@word",
        "group": "@word"
      },
      creationTimestamp: +Mock.Random.date('T')
    },
    status: {
      'phase|1': ['Active', 'Terminating']
    }
  }));
}

module.exports = [
  // 模拟获取 Namespace 列表接口
  {
    url: '/api/k8s/namespaces',
    type: 'get',
    response: config => {
      const { filter_name, page = 1, limit = 10 } = config.query;

      let mockList = List.filter(item => {
        if (filter_name && item.metadata.name.indexOf(filter_name) < 0) return false;
        return true;
      });

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1));

      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: pageList
        }
      };
    }
  },
  // 模拟获取 Namespace 详情接口
  {
    url: '/api/k8s/namespaces/detail',
    type: 'get',
    response: config => {
      const { namespace_name } = config.query;
      const namespace = List.find(item => item.metadata.name === namespace_name);

      if (!namespace) {
        return {
          code: 50000,
          msg: `获取 Namespace 详情失败, 未找到名为 ${namespace_name} 的 Namespace`
        };
      }

      return {
        code: 20000,
        data: namespace
      };
    }
  },
  // 模拟更新 Namespace 接口
  {
    url: '/api/k8s/namespaces/update',
    type: 'put',
    response: () => {
      return {
        code: 20000,
        msg: '更新成功'
      };
    }
  },
  // 模拟删除 Namespace 接口
  {
    url: '/api/k8s/namespaces/delete',
    type: 'delete',
    response: () => {
      return {
        code: 20000,
        msg: '删除成功'
      };
    }
  }
];
