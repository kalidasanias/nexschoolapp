/**
 * Created by senthil-p on 26/05/17.
 */
'use strict';

const WILD_USER = 'Any';
const EMP_USER: any = 'Employee';
const STUDENT_USER: any = 'Student';
const ADMIN_USER: any = 'SchoolAdmin';
const SUPER_ADMIN_USER: any = 'SuperAdmin';

export const W_USER: any = [WILD_USER];
export const E_USER: any = [EMP_USER];
export const S_USER: any = [STUDENT_USER];
export const A_USER: any = [ADMIN_USER];
export const SA_USER: any = [SUPER_ADMIN_USER];

export const ES_USER: any = [EMP_USER, STUDENT_USER];
export const AS_USER: any = [ADMIN_USER, STUDENT_USER];
export const ASA_USER: any = [ADMIN_USER, SUPER_ADMIN_USER];
export const ALL_USER: any = [ADMIN_USER, SUPER_ADMIN_USER, EMP_USER, STUDENT_USER];
export const ASAE_USER: any = [ADMIN_USER, SUPER_ADMIN_USER, EMP_USER];
