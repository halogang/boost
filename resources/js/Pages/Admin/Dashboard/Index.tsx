import React, { useEffect, useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageHeader } from '@/Components/PageHeader';
import { breadcrumbPresets } from '@/lib/page-utils';
import { DataTable, DataTableServerResponse } from '@/Components/DataTable';


export default function Index() {
  

  

  return (
    <AdminLayout title="Kelola User">
      <PageHeader
        title="Dashboard Admin"
        description="Manajemen pengguna dan akun sistem"
        breadcrumbs={breadcrumbPresets.adminUsers()}
        actions={
          <h1>test</h1>
        }
      />
      dashboard
    </AdminLayout>
  );
}
