<template>
    <div class="pvc">
        <el-row>
            <el-col :span="24">
                <div>
                    <el-card class="pvc-head-card" shadow="never" :body-style="{padding:'10px'}">
                        <el-row>
                            <el-col :span="6">
                                <div>
                                    <span>命名空间: </span>
                                    <el-select v-model="namespaceValue" filterable placeholder="请选择">
                                        <el-option
                                        v-for="(item, index) in namespaceList"
                                        :key="index"
                                        :label="item.metadata.name"
                                        :value="item.metadata.name">
                                        </el-option>
                                    </el-select>
                                </div>
                            </el-col>
                            <el-col :span="2" :offset="16">
                                <div>
                                    <el-button style="border-radius:2px;" icon="Refresh" plain @click="getPvcs()">刷新</el-button>
                                </div>
                            </el-col>
                        </el-row>
                    </el-card>
                </div>
            </el-col>
            <el-col :span="24">
                <div>
                    <el-card class="pvc-head-card" shadow="never" :body-style="{padding:'10px'}">
                        <el-row>
                            <el-col :span="2">
                                <div>
                                    <el-button disabled style="border-radius:2px;" icon="Edit" type="primary">创建</el-button>
                                </div>
                            </el-col>
                            <el-col :span="6">
                                <div>
                                    <el-input class="pvc-head-search" clearable placeholder="请输入" v-model="searchInput"></el-input>
                                    <el-button style="border-radius:2px;" icon="Search" type="primary" plain @click="getPvcs()">搜索</el-button>
                                </div>
                            </el-col>
                        </el-row>
                    </el-card>
                </div>
            </el-col>
            <el-col :span="24">
                <div>
                    <el-card class="pvc-body-card" shadow="never" :body-style="{padding:'5px'}">
                        <el-table
                        style="width:100%;font-size:12px;margin-bottom:10px;"
                        :data="pvcList"
                        v-loading="appLoading">
                            <el-table-column width="20"></el-table-column>
                            <el-table-column align=left label="PVC名">
                                <template v-slot="scope">
                                    <a class="pvc-body-pvcname">{{ scope.row.metadata.name }}</a>
                                </template>
                            </el-table-column>
                            <el-table-column align=center label="标签">
                                <template v-slot="scope">
                                    <div v-for="(val, key) in scope.row.metadata.labels" :key="key">
                                        <el-popover
                                            placement="right"
                                            :width="200"
                                            trigger="hover"
                                            :content="key + ':' + val">
                                            <template #reference>
                                                <el-tag style="margin-bottom: 5px" type="warning">{{ ellipsis(key + ":" + val) }}</el-tag>
                                            </template>
                                        </el-popover>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column align=center label="状态">
                                <template v-slot="scope">
                                    <span :class="[scope.row.status.phase === 'Bound' ? 'success-status' : 'error-status']">{{ scope.row.status.phase }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column align=center prop="status.capacity.storage" label="容量">
                            </el-table-column>
                            <el-table-column align=center prop="status.accessModes[0]" label="访问模式">
                            </el-table-column>
                            <el-table-column align=center prop="spec.storageClassName" label="StorageClass">
                            </el-table-column>
                            <el-table-column align=center min-width="100" label="创建时间">
                                <template v-slot="scope">
                                    <el-tag type="info">{{ timeTrans(scope.row.metadata.creationTimestamp) }} </el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column align=center label="操作" width="200">
                                <template v-slot="scope">
                                    <el-button size="small" style="border-radius:2px;" icon="Edit" type="primary" plain @click="getPvcDetail(scope)">YAML</el-button>
                                    <el-button size="small" style="border-radius:2px;" icon="Delete" type="danger" @click="handleConfirm(scope, '删除', delPvc)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-pagination
                        class="pvc-body-pagination"
                        background
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-sizes="pagesizeList"
                        :page-size="pagesize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="pvcTotal">
                        </el-pagination>
                    </el-card>
                </div>
            </el-col>
        </el-row>
        <el-dialog title="YAML信息" v-model="yamlDialog" width="45%" top="5%">
            <codemirror
                :value="contentYaml"
                border
                :options="cmOptions"
                height="500"
                style="font-size:14px;"
                @change="onChange"
            ></codemirror>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="yamlDialog = false">取 消</el-button>
                    <el-button type="primary" @click="updatePvc()">更 新</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import common from "../common/Config";
import httpClient from '../../utils/request';
import yaml2obj from 'js-yaml';
import json2yaml from 'json2yaml';
export default {
    data() {
        return {
            //编辑器配置
            cmOptions: common.cmOptions,
            contentYaml: '',
            //分页
            currentPage: 1,
            pagesize: 10,
            pagesizeList: [10, 20, 30],
            //
            searchInput: '',
            namespaceValue: 'default',
            namespaceList: [],
            namespaceListUrl: common.k8sNamespaceList,
            appLoading: false,
            pvcList: [],
            pvcTotal: 0,
            getPvcsData: {
                url: common.k8sPvcList,
                params: {
                    filter_name: '',
                    namespace: '',
                    page: '',
                    limit: '',
                }
            },
            //详情
            pvcDetail: {},
            getPvcDetailData: {
                url: common.k8sPvcDetail,
                params: {
                    pvc_name: '',
                    namespace: ''
                }
            },
            //yaml更新
            yamlDialog: false,
            updatePvcData: {
                url: common.k8sPvcUpdate,
                params: {
                    namespace: '',
                    content: ''
                }
            },
            //删除
            delPvcData: {
                url: common.k8spvcDel,
                params: {
                    pvc_name: '',
                    namespace: '',
                }
            }
        }
    },
    methods: {
        transYaml(content) {
            return json2yaml.stringify(content)
        },
        transObj(content) {
            return yaml2obj.load(content)
        },
        onChange(val) {
            this.contentYaml = val
        },
        handleSizeChange(size) {
            this.pagesize = size;
            this.getPvcs()
        },
        handleCurrentChange(currentPage) {
            this.currentPage = currentPage;
            this.getPvcs()
        },
        handleClose(done) {
            this.$confirm('确认关闭？')
            .then(() => {
                done();
            })
            .catch(() => {});
        },
        ellipsis(value) {
            return value.length>15?value.substring(0,15)+'...':value
        },
        timeTrans(timestamp) {
            let date = new Date(new Date(timestamp).getTime() + 8 * 3600 * 1000)
            date = date.toJSON();
            date = date.substring(0, 19).replace('T', ' ')
            return date 
        },
        restartTotal(e) {
            let index, sum = 0
            let containerStatuses = e.row.status.containerStatuses
            for ( index in containerStatuses) {
                sum = sum + containerStatuses[index].restartCount 
            }
            return sum
        },
        getNamespaces() {
            httpClient.get(this.namespaceListUrl)
            .then(res => {
                this.namespaceList = res.data.items
            })
            .catch(res => {
                this.$message.error({
                message: res.msg
                })
            })
        },
        getPvcs() {
            this.appLoading = true
            this.getPvcsData.params.filter_name = this.searchInput
            this.getPvcsData.params.namespace = this.namespaceValue
            this.getPvcsData.params.page = this.currentPage
            this.getPvcsData.params.limit = this.pagesize
            httpClient.get(this.getPvcsData.url, {params: this.getPvcsData.params})
            .then(res => {
                this.pvcList = res.data.items
                this.pvcTotal = res.data.total
            })
            .catch(res => {
                this.$message.error({
                message: res.msg
                })
            })
            this.appLoading = false
        },
        getPvcDetail(e) {
            this.getPvcDetailData.params.pvc_name = e.row.metadata.name
            this.getPvcDetailData.params.namespace = this.namespaceValue
            httpClient.get(this.getPvcDetailData.url, {params: this.getPvcDetailData.params})
            .then(res => {
                this.pvcDetail = res.data
                this.contentYaml = this.transYaml(this.pvcDetail)
                this.yamlDialog = true
            })
            .catch(res => {
                this.$message.error({
                message: res.msg
                })
            })
        },
        updatePvc() {
            let content = JSON.stringify(this.transObj(this.contentYaml))
            this.updatePvcData.params.namespace = this.namespaceValue
            this.updatePvcData.params.content = content
            httpClient.put(this.updatePvcData.url, this.updatePvcData.params)
            .then(res => {
                this.$message.success({
                message: res.msg
                })
            })
            .catch(res => {
                this.$message.error({
                message: res.msg
                })
            })
            this.yamlDialog = false
        },
        delPvc(e) {
            this.delPvcData.params.pvc_name = e.row.metadata.name
            this.delPvcData.params.namespace = this.namespaceValue
            httpClient.delete(this.delPvcData.url, {data: this.delPvcData.params})
            .then(res => {
                this.getPvcs()
                this.$message.success({
                message: res.msg
                })
            })
            .catch(res => {
                this.$message.error({
                message: res.msg
                })
            })
        },
        handleConfirm(obj, operateName, fn) {
            this.confirmContent = '确认继续 ' + operateName + ' 操作吗？'
            this.$confirm(this.confirmContent,'提示',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            })
            .then(() => {
                fn(obj)
                })
            .catch(() => {
                this.$message.info({
                    message: '已取消操作'
                })          
            })
        },
    },
    watch: {
        namespaceValue: {
            handler() {
                localStorage.setItem('namespace', this.namespaceValue)
                this.currentPage = 1
                this.getPvcs()
            }
        },
    },
    beforeMount() {
        if (localStorage.getItem('namespace') !== undefined && localStorage.getItem('namespace') !== null) {
            this.namespaceValue = localStorage.getItem('namespace')
        }
        this.getNamespaces()
        this.getPvcs()
    }
}
</script>


<style scoped>
    .pvc-head-card,.pvc-body-card {
        border-radius: 1px;
        margin-bottom: 5px;
    }
    .pvc-head-search {
        width:160px;
        margin-right:10px; 
    }
    .pvc-body-pvcname {
        color: #4795EE;
    }
    .pvc-body-pvcname:hover {
        color: rgb(84, 138, 238);
        cursor: pointer;
        font-weight: bold;
    }
    .success-status {
        color: rgb(27, 202, 21);
    }
    .warning-status {
        color: rgb(233, 200, 16);
    }
    .error-status {
        color: rgb(226, 23, 23);
    }
</style>