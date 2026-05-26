import { ModalProps } from '../../../models/interfaces';

export interface RoleModalProps extends ModalProps {
  isUpdate: boolean;
  handleSave: () => void;
  handleClose: () => void;
}

export interface RoleForm {
  name: string;
  description: string;
  permission_ids: number[];
}
