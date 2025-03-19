const Mock = require('mockjs');

// 生成模拟Pod数据
const List = [];
const count = 20; // 生成20条模拟数据

for (let i = 0; i < count; i++) {
    List.push(Mock.mock({
        metadata: {
            name: `pod-${i}`,
            creationTimestamp: +Mock.Random.date('T'),
            labels: {
                "app": "@word",
                "group": "@word"
            }
        },
        spec: {
            containers: [
                {
                    name: `container-${i}`,
                    image: `image-${i}:latest`,
                    ports: [
                        {
                            containerPort: Mock.Random.integer(1000, 65535)
                        }
                    ]
                }
            ]
        },
        status: {
            phase: Mock.Random.pick(['Pending', 'Running', 'Succeeded', 'Failed']),
            podIP: '@ip'
        }
    }));
}

module.exports = [
    // 模拟获取Pod列表接口
    {
        url: '/api/k8s/pods',
        type: 'get',
        response: config => {
            const { filter_name, namespace, page = 1, limit = 10 } = config.query;

            let mockList = List.filter(item => {
                if (filter_name && item.metadata.name.indexOf(filter_name) < 0) return false;
                if (namespace && item.metadata.namespace!== namespace) return false;
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
    // 模拟获取Pod详情接口
    {
        url: '/api/k8s/pods/detail',
        type: 'get',
        response: config => {
            const { pod_name, namespace } = config.query;
            const pod = List.find(item => item.metadata.name === pod_name);

            if (!pod) {
                return {
                    code: 50000,
                    msg: `获取Pod详情失败, 未找到名为 ${pod_name} 的Pod`
                };
            }

            return {
                code: 20000,
                data: pod
            };
        }
    },
    // 模拟创建Pod接口
    {
        url: '/api/k8s/pods/create',
        type: 'post',
        response: () => {
            return {
                code: 20000,
                msg: 'Pod创建成功'
            };
        }
    },
    // 模拟更新Pod接口
    {
        url: '/api/k8s/pods/update',
        type: 'put',
        response: () => {
            return {
                code: 20000,
                msg: 'Pod更新成功'
            };
        }
    },
    // 模拟删除Pod接口
    {
        url: '/api/k8s/pods/delete',
        type: 'delete',
        response: () => {
            return {
                code: 20000,
                msg: 'Pod删除成功'
            };
        }
    },
    // 模拟获取Pod容器信息接口
    {
        url: '/api/k8s/pods/container',
        type: 'get',
        response: config => {
            const { pod_name, namespace } = config.query;
            const pod = List.find(item => item.metadata.name === pod_name);

            if (!pod) {
                return {
                    code: 50000,
                    msg: `获取Pod容器信息失败, 未找到名为 ${pod_name} 的Pod`
                };
            }

            return {
                code: 20000,
                data: pod.spec.containers
            };
        }
    },
    // 模拟获取Pod日志接口
    {
        url: '/api/k8s/pods/log',
        type: 'get',
        response: config => {
            const { pod_name, namespace } = config.query;
            const pod = List.find(item => item.metadata.name === pod_name);

            if (!pod) {
                return {
                    code: 50000,
                    msg: `获取Pod日志失败, 未找到名为 ${pod_name} 的Pod`
                };
            }

            return {
                code: 20000,
                data: `Mocked log for pod ${pod_name}`
            };
        }
    },
    // 模拟获取Pod数量和节点数量接口
    {
        url: '/api/k8s/pods/numnp',
        type: 'get',
        response: () => {
            return {
                code: 20000,
                data: {
                    podNum: List.length,
                    nodeNum: Mock.Random.integer(1, 10)
                }
            };
        }
    }
];