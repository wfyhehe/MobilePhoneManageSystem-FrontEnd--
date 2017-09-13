import Vue from 'vue'
import Router from 'vue-router'

const SignIn = (resolve) => {
  import('@/components/SignIn').then((module) => {
    resolve(module)
  })
}

const Home = (resolve) => {
  import('@/components/Home').then((module) => {
    resolve(module)
  })
}

const SignUp = (resolve) => {
  import('@/components/SignUp').then((module) => {
    resolve(module)
  })
}

const Page404 = (resolve) => {
  import('@/components/Page404').then((module) => {
    resolve(module)
  })
}

const UserManage = (resolve) => {
  import('@/components/system_manage/UserManage').then((module) => {
    resolve(module)
  })
}

const UserDetail = (resolve) => {
  import('@/components/system_manage/UserDetail').then((module) => {
    resolve(module)
  })
}

const AuthManage = (resolve) => {
  import('@/components/system_manage/AuthManage').then((module) => {
    resolve(module)
  })
}

const MenuManage = (resolve) => {
  import('@/components/system_manage/MenuManage').then((module) => {
    resolve(module)
  })
}

const MenuDetail = (resolve) => {
  import('@/components/system_manage/MenuDetail').then((module) => {
    resolve(module)
  })
}

const RoleManage = (resolve) => {
  import('@/components/system_manage/RoleManage').then((module) => {
    resolve(module)
  })
}

const RoleDetail = (resolve) => {
  import('@/components/system_manage/RoleDetail').then((module) => {
    resolve(module)
  })
}

const DeptManage = (resolve) => {
  import('@/components/base_config/DeptManage').then((module) => {
    resolve(module)
  })
}

const DeptDetail = (resolve) => {
  import('@/components/base_config/DeptDetail').then((module) => {
    resolve(module)
  })
}

const EmployeeManage = (resolve) => {
  import('@/components/base_config/EmployeeManage').then((module) => {
    resolve(module)
  })
}

const EmployeeDetail = (resolve) => {
  import('@/components/base_config/EmployeeDetail').then((module) => {
    resolve(module)
  })
}

const LogManage = (resolve) => {
  import('@/components/system_manage/LogManage').then((module) => {
    resolve(module)
  })
}

const SupplierType = (resolve) => {
  import('@/components/base_config/SupplierType').then((module) => {
    resolve(module)
  })
}

const SupplierTypeDetail = (resolve) => {
  import('@/components/base_config/SupplierTypeDetail').then((module) => {
    resolve(module)
  })
}

const Supplier = (resolve) => {
  import('@/components/base_config/Supplier').then((module) => {
    resolve(module)
  })
}

const SupplierDetail = (resolve) => {
  import('@/components/base_config/SupplierDetail').then((module) => {
    resolve(module)
  })
}

const RebateType = (resolve) => {
  import('@/components/base_config/RebateType').then((module) => {
    resolve(module)
  })
}

const RebateTypeDetail = (resolve) => {
  import('@/components/base_config/RebateTypeDetail').then((module) => {
    resolve(module)
  })
}

const Color = (resolve) => {
  import('@/components/base_config/Color').then((module) => {
    resolve(module)
  })
}

const Brand = (resolve) => {
  import('@/components/base_config/Brand').then((module) => {
    resolve(module)
  })
}

const Config = (resolve) => {
  import('@/components/base_config/Config').then((module) => {
    resolve(module)
  })
}

const MobileModel = (resolve) => {
  import('@/components/base_config/MobileModel').then((module) => {
    resolve(module)
  })
}

const MobileModelDetail = (resolve) => {
  import('@/components/base_config/MobileModelDetail').then((module) => {
    resolve(module)
  })
}

const Account = (resolve) => {
  import('@/components/account_business/Account').then((module) => {
    resolve(module)
  })
}

const AccountDetail = (resolve) => {
  import('@/components/account_business/AccountDetail').then((module) => {
    resolve(module)
  })
}

const MobileInbound = (resolve) => {
  import('@/components/supplier_business/MobileInbound').then((module) => {
    resolve(module)
  })
}

const InboundList = (resolve) => {
  import('@/components/supplier_business/InboundList').then((module) => {
    resolve(module)
  })
}

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [{
    path: '/sign_in',
    component: SignIn
  }, {
    path: '/home',
    alias: '/',
    component: Home
  }, {
    path: '/sign_up',
    component: SignUp
  }, {
    path: '/404',
    alias: '*',
    component: Page404
  }, {
    path: '/user_manage',
    component: UserManage,
    children: [{
      path: ':id',
      component: UserDetail
    }]
  }, {
    path: '/auth_manage',
    component: AuthManage
  }, {
    path: '/menu_manage',
    component: MenuManage,
    children: [{
      path: ':id',
      component: MenuDetail
    }]
  }, {
    path: '/role_manage',
    component: RoleManage,
    children: [{
      path: ':id',
      component: RoleDetail
    }]
  }, {
    path: '/dept_manage',
    component: DeptManage,
    children: [{
      path: ':id',
      component: DeptDetail
    }]
  }, {
    path: '/employee_manage',
    component: EmployeeManage,
    children: [{
      path: ':id',
      component: EmployeeDetail
    }]
  }, {
    path: '/log_manage',
    component: LogManage
  }, {
    path: '/supplier_type',
    component: SupplierType,
    children: [{
      path: ':id',
      component: SupplierTypeDetail
    }]
  }, {
    path: '/supplier',
    component: Supplier,
    children: [{
      path: ':id',
      component: SupplierDetail
    }]
  }, {
    path: '/rebate_type',
    component: RebateType,
    children: [{
      path: ':id',
      component: RebateTypeDetail
    }]
  }, {
    path: '/color',
    component: Color
  }, {
    path: '/brand',
    component: Brand
  }, {
    path: '/config',
    component: Config
  }, {
    path: '/mobile_model',
    component: MobileModel,
    children: [{
      path: ':id',
      component: MobileModelDetail
    }]
  }, {
    path: '/account',
    component: Account,
    children: [{
      path: ':id',
      component: AccountDetail
    }]
  }, {
    path: '/mobile_inbound',
    component: MobileInbound
  }, {
    path: '/inbound_list',
    component: InboundList
  }]
})
