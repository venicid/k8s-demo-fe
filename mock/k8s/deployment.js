const Mock = require('mockjs');

// 生成模拟 Deployment 数据
const List = [];
const count = 20; // 生成 20 条模拟数据

for (let i = 0; i < count; i++) {
    List.push(Mock.mock({
        metadata: {
            name: `deployment-${i}`,
            creationTimestamp: +Mock.Random.date('T'),
            labels: {
                "app": "@word",
                "group": "@word"
            }
        },
        spec: {
            replicas: Mock.Random.integer(1, 10),
            template: {
                spec: {
                    containers: [
                        {
                            image: `image-${i}:latest`
                        }
                    ]
                }
            }
        },
        status: {
            availableReplicas: Mock.Random.integer(0, 10),
            replicas: Mock.Random.integer(1, 10)
        }
    }));
}

module.exports = [
    // 模拟获取 Deployment 列表接口
    {
        url: '/api/k8s/deployments',
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
    // 模拟获取 Deployment 详情接口
    {
        url: '/api/k8s/deployments/detail',
        type: 'get',
        response: config => {
            const { deployment_name, namespace } = config.query;
            const deployment = List.find(item => item.metadata.name === deployment_name);

            if (!deployment) {
                return {
                    code: 50000,
                    msg: `获取 Deployment 详情失败, 未找到名为 ${deployment_name} 的 Deployment`
                };
            }

            return {
                code: 20000,
                data: deployment
            };
        }
    },
    // 模拟创建 Deployment 接口
    {
        url: '/api/k8s/deployments/create',
        type: 'post',
        response: () => {
            return {
                code: 20000,
                msg: 'Deployment 创建成功'
            };
        }
    },
    // 模拟更新 Deployment 接口
    {
        url: '/api/k8s/deployments/update',
        type: 'put',
        response: () => {
            return {
                code: 20000,
                msg: 'Deployment 更新成功'
            };
        }
    },
    // 模拟删除 Deployment 接口
    {
        url: '/api/k8s/deployments/delete',
        type: 'delete',
        response: () => {
            return {
                code: 20000,
                msg: 'Deployment 删除成功'
            };
        }
    },
    // 模拟重启 Deployment 接口
    {
        url: '/api/k8s/deployments/restart',
        type: 'post',
        response: () => {
            return {
                code: 20000,
                msg: 'Deployment 重启成功'
            };
        }
    },
    // 模拟扩缩容 Deployment 接口
    {
        url: '/api/k8s/deployments/scale',
        type: 'post',
        response: () => {
            return {
                code: 20000,
                msg: 'Deployment 扩缩容成功'
            };
        }
    }
];