import { CreateDepartment, UpdateDepartment } from "models/http/requests/department.request.models";
import { DepartmentResponse } from "models/http/responses/department.responde.model";
import { ModalProps } from "models/interfaces";

export interface DepartmentModalProps extends ModalProps{
  isUpdate: boolean;
  onCreate: (data: CreateDepartment) => void;
  onUpdate: (id: number, data: UpdateDepartment) => void;
  selectedDepartment?: DepartmentResponse;
}

export interface DepartmentForm {
  building_id: number;
  name: string;
  abbreviation: string;
  professors: string[];
  subjects_ids?: number[];
  classrooms_ids?: number[];
}