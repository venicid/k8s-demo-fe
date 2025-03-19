const Mock = require('mockjs');

// 生成模拟命名空间数据
const namespaceList = [];
const namespaceCount = 5;
for (let i = 0; i < namespaceCount; i++) {
    namespaceList.push(Mock.mock({
        metadata: {
            name: `namespace-${i}`,
        }
    }));
}

// 生成模拟工作流数据
const workflowList = [];
const workflowCount = 10;
for (let i = 0; i < workflowCount; i++) {
    workflowList.push(Mock.mock({
        id: `workflow-${i}`,
        name: `workflow-name-${i}`,
        type: Mock.Random.pick(['ClusterIP', 'NodePort', 'Ingress']),
        replicas: Mock.Random.integer(1, 10),
        deployment: `deployment-${i}`,
        service: `service-${i}`,
        ingress: `ingress-${i}`,
        created_at: +Mock.Random.date('T'),
    }));
}

module.exports = [
    // 模拟获取命名空间列表接口
    {
        url: '/api/k8s/namespaces',
        type: 'get',
        response: () => {
            return {
                code: 20000,
                data: {
                    items: namespaceList
                }
            };
        }
    },
    // 模拟获取工作流列表接口
    {
        url: '/api/k8s/workflows',
        type: 'get',
        response: config => {
            const { name, namespace, page = 1, limit = 10 } = config.query;

            let mockList = workflowList.filter(item => {
                if (name && item.name.indexOf(name) < 0) return false;
                if (namespace && item.namespace!== namespace) return false;
                return true;
            });

            const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1));

            return {
                code: 20000,
                data: {
                    items: pageList,
                    total: mockList.length
                }
            };
        }
    },
    // 模拟创建工作流接口
    {
        url: '/api/k8s/workflow/create',
        type: 'post',
        response: () => {
            return {
                code: 20000,
                msg: '工作流创建成功'
            };
        }
    },
    // 模拟删除工作流接口
    {
        url: '/api/k8s/workflow/delete',
        type: 'delete',
        response: () => {
            return {
                code: 20000,
                msg: '工作流删除成功'
            };
        }
    }
];
