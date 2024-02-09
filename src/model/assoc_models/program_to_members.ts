import { Program } from "../program";

export interface ProgramToMembers {

    // TODO: Learning Objet Metadata (LOM)
    lomId: number;

    projectId: Program;
    memberId: Member;
    
    // NOTE: specific to relation
    lotacaoExercicio: string | null;
    lotacaoOficial: string | null;
    memberRole: MemberRole,
    cargaHoraria: string | null;
    periodo: string | null;
    recebeBolsa: string | null;
}

// TODO: This member, has these attributes, to this project