
export default {
    // 后端接口路径
    // loginAuth: 'http://localhost:9090/api/login',
    loginAuth: '/api/login',

    k8sWorkflowCreate: '/api/k8s/workflow/create',
    k8sWorkflowDetail: '/api/k8s/workflow/detail',
    k8sWorkflowList: '/api/k8s/workflows',
    k8sWorkflowDel: '/api/k8s/workflow/delete',

    k8sDeploymentList: '/api/k8s/deployments',
    k8sDeploymentDetail: '/api/k8s/deployment/detail',
    k8sDeploymentUpdate: '/api/k8s/deployment/update',
    k8sDeploymentScale: '/api/k8s/deployment/scale',
    k8sDeploymentRestart: '/api/k8s/deployment/restart',

    k8sDeploymentDel: '/api/k8s/deployment/del',
    k8sDeploymentCreate: '/api/k8s/deployment/create',
    k8sDeploymentNumNp: '/api/k8s/deployment/numnp',

    k8sPodList: '/api/k8s/pods',
    k8sPodDetail: '/api/k8s/pod/detail',
    k8sPodUpdate: '/api/k8s/pod/update',
    k8sPodDel: '/api/k8s/pod/del',
    k8sPodContainer: '/api/k8s/pod/container',
    k8sPodLog: '/api/k8s/pod/log',
    k8sPodNumNp: '/api/k8s/pod/numnp',

    // 修改部分
    k8sDaemonSetList: '/api/k8s/daemonsets',
    k8sDaemonSetDetail: '/api/k8s/daemonset/detail',
    k8sDaemonSetUpdate: '/api/k8s/daemonset/update',
    k8sDaemonSetDel: '/api/k8s/daemonset/del',
    k8sStatefulSetList: '/api/k8s/statefulsets',
    k8sStatefulSetDetail: '/api/k8s/daemonset/detail',
    k8sStatefulSetUpdate: '/api/k8s/daemonset/update',
    k8sStatefulSetDel: '/api/k8s/daemonset/del',
    k8sServiceList: '/api/k8s/services',
    k8sServiceDetail: '/api/k8s/service/detail',
    k8sServiceUpdate: '/api/k8s/service/update',
    k8sServiceDel: '/api/k8s/service/del',
    k8sServiceCreate: '/api/k8s/service/create',
    k8sIngressList: '/api/k8s/ingresses',
    k8sIngressDetail: '/api/k8s/ingress/detail',
    k8sIngressUpdate: '/api/k8s/ingress/update',
    k8sIngressDel: '/api/k8s/ingress/del',
    k8sIngressCreate: '/api/k8s/ingress/create',
    k8sConfigMapList: '/api/k8s/configmaps',
    k8sConfigMapDetail: '/api/k8s/configmap/detail',
    k8sConfigMapUpdate: '/api/k8s/configmap/update',
    k8sConfigMapDel: '/api/k8s/configmap/del',
    k8sSecretList: '/api/k8s/secrets',
    k8sSecretDetail: '/api/k8s/secret/detail',
    k8sSecretUpdate: '/api/k8s/secret/update',
    k8sSecretDel: '/api/k8s/secret/del',
    k8sPvcList: '/api/k8s/pvcs',
    k8sPvcDetail: '/api/k8s/pvc/detail',
    k8sPvcUpdate: '/api/k8s/pvc/update',
    k8sPvcDel: '/api/k8s/pvc/del',

    // k8sNodeList: 'http://localhost:9090/api/k8s/nodes',
    k8sNodeList: `/api/k8s/nodes`,
    k8sNodeDetail: '/api/k8s/node/detail',
    // k8sNamespaceList: 'http://localhost:9090/api/k8s/namespaces',
    k8sNamespaceList: `/api/k8s/namespaces`,
    k8sNamespaceDetail: '/api/k8s/namespace/detail',
    k8sNamespaceDel: '/api/k8s/namespace/del',
    k8sPvList: '/api/k8s/pvs',
    k8sPvDetail: '/api/k8s/pv/detail',

    k8sTerminalWs: 'ws://localhost:8081/ws',

    // 编辑器配置
    cmOptions: {
        // 语言及语法模式
        mode: 'text/yaml',
        // 主题
        theme: 'idea',
        // 显示行数
        lineNumbers: true,
        smartIndent: true, // 智能缩进
        indentUnit: 4, // 智能缩进单元长度为 4 个空格
        styleActiveLine: true, // 显示选中行的样式
        matchBrackets: true, // 每当光标位于匹配的方括号旁边时，都会使其高亮显示
        readOnly: false,
        lineWrapping: true // 自动换行
    }
};
