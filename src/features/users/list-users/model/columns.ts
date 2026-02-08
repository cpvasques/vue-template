export const usersTableColumns = [
  {
    key: 'name',
    label: 'Nome do usuário',
    sortable: true,
    headerClass:
      'bg-background font-normal text-muted-foreground text-sm h-12! py-0! px-3! text-nowrap',
    cellClass:
      'px-3! py-0! bg-background font-normal text-sm text-primary h-12! min-w-96 text-nowrap',
  },
  {
    key: 'email',
    label: 'E-mail',
    sortable: true,
    headerClass:
      'bg-background font-normal text-muted-foreground text-sm h-12! py-0! px-3! text-nowrap',
    cellClass:
      'px-3! py-0! bg-background font-normal text-sm text-primary h-12! text-sky-600! font-medium text-nowrap',
  },
  {
    key: 'phone',
    label: 'Telefone',
    sortable: true,
    headerClass:
      'bg-background font-normal text-muted-foreground text-sm h-12! py-0! px-3! text-nowrap',
    cellClass:
      'px-3! py-0! bg-background font-normal text-sm text-primary h-12! text-nowrap',
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    headerClass:
      'bg-background font-normal  text-muted-foreground text-sm h-12! py-0! px-3! text-nowrap',
    cellClass:
      'px-3! py-0! bg-background font-normal text-sm text-primary h-12! text-nowrap',
  },
  {
    key: 'created_at',
    label: 'Data de Cadastro',
    sortable: true,
    headerClass:
      'bg-background font-normal text-muted-foreground text-sm h-12! py-0! px-3! text-nowrap',
    cellClass:
      'px-3! py-0! bg-background font-normal text-sm text-primary h-12! text-nowrap',
  },
  {
    key: 'actions',
    label: 'Ações',
    headerClass:
      'bg-background font-normal text-muted-foreground text-sm h-12! py-0! px-3! w-5 text-nowrap',
    cellClass: 'px-3! py-0! bg-background text-right text-center! text-nowrap',
  },
]
