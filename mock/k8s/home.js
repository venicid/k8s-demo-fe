const Mock = require('mockjs');

// 模拟命名空间数据
const namespaceList = Mock.mock({
    'total|1-10': 1,
    'items|5-10': [
        {
            'status': {
                'phase': Mock.Random.pick(['Active', 'Terminating'])
            }
        }
    ]
});

// 模拟节点数据
const nodeList = Mock.mock({
    'total|1-5': 1,
    'items|3-8': [
        {
            'status': {
                'allocatable': {
                    'cpu': Mock.Random.integer(1, 8),
                    'memory': Mock.Random.integer(1024 * 1024, 8 * 1024 * 1024),
                    'pods': Mock.Random.integer(10, 50)
                },
                'capacity': {
                    'cpu': Mock.Random.integer(1, 8),
                    'memory': Mock.Random.integer(1024 * 1024, 8 * 1024 * 1024),
                    'pods': Mock.Random.integer(10, 50)
                }
            }
        }
    ]
});

// 模拟 Deployment 数据
const deploymentList = Mock.mock({
    'total|5-20': 1
});

// 模拟 Pod 数据
const podList = Mock.mock({
    'total|10-50': 1
});

// 模拟每个命名空间中 Pod 数量数据
const podNumNp = Mock.mock({
    '|3-8': [
        {
            'namespace': '@word',
            'pod_num': Mock.Random.integer(1, 20)
        }
    ]
});

// 模拟每个命名空间中 Deployment 数量数据
const deploymentNumNp = Mock.mock({
    '|3-8': [
        {
            'namespace': '@word',
            'deployment_num': Mock.Random.integer(1, 10)
        }
    ]
});

module.exports = [
    // 模拟获取命名空间列表接口
    {
        url: '/api/k8s/namespaces',
        type: 'get',
        response: () => {
            return {
                code: 20000,
                data: namespaceList
            };
        }
    },
    // 模拟获取节点列表接口
    {
        url: '/api/k8s/nodes',
        type: 'get',
        response: () => {
            return {
                code: 20000,
                data: nodeList
            };
        }
    },
    // 模拟获取 Deployment 总数接口
    {
        url: '/api/k8s/deployments',
        type: 'get',
        response: () => {
            return {
                code: 20000,
                data: deploymentList
            };
        }
    },
    // 模拟获取 Pod 总数接口
    {
        url: '/api/k8s/pods',
        type: 'get',
        response: () => {
            return {
                code: 20000,
                data: podList
            };
        }
    },
    // 模拟获取每个命名空间中 Pod 数量接口
    {
        url: '/api/k8s/pod/numnp',
        type: 'get',
        response: () => {
            return {
                code: 20000,
                data: podNumNp
            };
        }
    },
    // 模拟获取每个命名空间中 Deployment 数量接口
    {
        url: '/api/k8s/deployment/numnp',
        type: 'get',
        response: () => {
            return {
                code: 20000,
                data: deploymentNumNp
            };
        }
    }
];