<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div style="margin-top: 15px">
        <el-row :gutter="10">
          <el-col :span="10">
            <el-input
              placeholder="请输入内容"
              v-model="queryInfo.query"
              clearable
              @clear="getUserList"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="getUserList"
              ></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="addDialogVisible = true"
              >添加用户</el-button
            >
          </el-col>
        </el-row>
        <el-table :data="userlist" border stripe>
          <el-table-column label="#" type="index"></el-table-column>
          <el-table-column label="姓名" prop="username"></el-table-column>
          <el-table-column label="邮箱" prop="email"></el-table-column>
          <el-table-column label="电话" prop="mobile"></el-table-column>
          <el-table-column label="角色" prop="role_name"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <!-- {{scope.row}} -->
              <el-switch
                v-model="scope.row.mg_state"
                @change="userStateChanged(scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180px">
            <template slot-scope="scope">
              <el-tooltip
                effect="dark"
                content="编辑"
                placement="top"
                :enterable="false"
              >
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.id)"
                ></el-button>
              </el-tooltip>
              <el-tooltip
                effect="dark"
                content="删除"
                placement="top"
                :enterable="false"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeuserById(scope.row.id)"
                ></el-button>
              </el-tooltip>
              <el-tooltip
                effect="dark"
                content="分配角色"
                placement="top"
                :enterable="false"
              >
                <el-button
                  type="warning"
                  icon="el-icon-setting"
                  size="mini"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <!-- //分页区域 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </el-card>
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogColsed"
    >
      <!-- 内容主题区 -->
      <!-- 表单 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogColsed">
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="用户名">
          <el-input  v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input  v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input  v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">修 改</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name:"Users",
  data() {
    //验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      //验证邮箱的正则
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      if (regEmail.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法的邮箱"));
    }
    //验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      //验证手机号的正则
      const regMobile = /^(0|86\17951)?(13[0-9]|15[0123456789]|17[678|18[0-9]|14[57])[0-9]{8}$/;
      if (regMobile.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法的手机号"));
    };
    return {
      //获取用户列表的参数对象
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2,
        // 当前每页显示多少条数据
      },
      userlist: [],
      total: 0,
      //控制添加用户对话框的显示与隐藏
      addDialogVisible: false,
      editDialogVisible: false,
      editForm:{},
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "用户长度在3-10个之间", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 15, message: "密码长度在6-15个之间", trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      editFormRules: {
       email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      }
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get("/users", {
        params: this.queryInfo,
      });
      // console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error("获取用户列表失败");
      this.userlist = res.data.users;
      this.total = res.data.total;
    },
    //监听pagsize改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    //监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
    async userStateChanged(userinfo) {
      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      );
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state;
        return this.$message.error("更新用户状态失败");
      }
      this.$message.success("更新用户状态成功");
    },
    addDialogColsed() {
      this.$refs.addFormRef.resetFields();
    },
    editDialogColsed(){
      this.$refs.editFormRef.resetFields();
    },
    //点击按钮添加新用户
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        //可以发起添加用户的网络请求
        const { data: res } = await this.$http.post("/users", this.addForm);
        if (res.meta.status !== 201) return this.$message.error("添加失败");
        this.$message.success("添加成功");
        this.addDialogVisible = false;
        this.getUserList();
      });
    },
    //展示用户编辑的对话框
    async showEditDialog(id) {
      // console.log(id);
      const {data: res} = await this.$http.get('users/' + id)
      if(res.meta.status !== 200) return this.$message.error('查询用户信息失败')
      this.editForm = res.data
      // console.log();
      this.editDialogVisible = true
    },
    editUserInfo(){
      this.$refs.editFormRef.validate(async (valid,id) => {
        if (!valid) return;
        //可以发起添加用户的网络请求
        const { data: res } = await this.$http.put("users/" + this.editForm.id, {
          email:this.editForm.email,
          mobile:this.editForm.mobile
          });
        if (res.meta.status !== 200) return this.$message.error("添加失败");
        this.$message.success("添加成功");
        this.editDialogVisible = false;
        this.getUserList();
        this.$message.success('更新用户信息成功')
      });
    },
    async removeuserById(id){
    const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        if(confirmResult !== 'confirm') {
          return this.$message.info('已经取消了删除')
        }
        // this.$message.success('删除成功')
        // console.log(id);
        const {data: res} = await this.$http.delete('users/' + id)
        if(res.meta.status !== 200) return this.$message.error('删除失败')
        this.$message.success('删除成功')
        if (this.userlist.length === 1) {
           this.queryInfo.pagenum = this.queryInfo.pagenum > 1 ? this.queryInfo.pagenum - 1 : 1 
           } 
        this.getUserList()
  }
  }
  
};
</script>
<style lang="less" scoped>
.el-table {
  /deep/ th {
    text-align: center;
  }
}
</style>