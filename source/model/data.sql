-- Table: public."Exam"

DROP TABLE public."Exam";

CREATE TABLE public."Exam"
(
    "ExamId" bigint NOT NULL DEFAULT nextval('"Exam_ExamId_seq"'::regclass),
    "ExamName" character varying COLLATE pg_catalog."default" NOT NULL,
    "QuestionList" text COLLATE pg_catalog."default",
    "IsPublished" boolean NOT NULL,
    "Secret" character varying COLLATE pg_catalog."default",
    "Resubmission" integer,
    "CreatedBy" character varying COLLATE pg_catalog."default" NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedBy" character varying COLLATE pg_catalog."default",
    "UpdatedAt" timestamp with time zone,
    "Time" integer,
    "Structure" text COLLATE pg_catalog."default",
    "GradeSubjectId" integer,
    "Deadline" timestamp with time zone,
    CONSTRAINT "Exam_pkey" PRIMARY KEY ("ExamId"),
    CONSTRAINT "fk_Exam_CreatedBy" FOREIGN KEY ("CreatedBy")
        REFERENCES public."User" ("UserId") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT "fk_Exam_GradeSubjectId" FOREIGN KEY ("GradeSubjectId")
        REFERENCES public."GradeSubject" ("Id") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT "fk_Exam_UpdatedBy" FOREIGN KEY ("UpdatedBy")
        REFERENCES public."User" ("UserId") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public."Exam"
    OWNER to postgres;