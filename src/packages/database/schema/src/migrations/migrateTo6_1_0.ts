import {Database} from "@database/async";

export const migrateTo6_1_0 = async (db: Database): Promise<void> => {
  await db.exec(`

    --------------------------------------------------------------------------------------
    -- Update evaluation_trait_table with columns, constraints, and seed values
    --------------------------------------------------------------------------------------
    
    DROP TABLE IF EXISTS evaluation_trait_table;
    
    CREATE TABLE "evaluation_trait_table" 
      ("id_evaluationtraitid" TEXT PRIMARY KEY
      , "trait_name" TEXT NOT NULL CONSTRAINT unique_evaluation_trait_table_trait_name UNIQUE
      , "trait_abbrev" TEXT NOT NULL CONSTRAINT unique_evaluation_trait_table_trait_abbrev UNIQUE
      , "id_evaluationtraittypeid" TEXT NOT NULL
      , "evaluation_trait_display_order" INTEGER NOT NULL
      , "id_unitstypeid" TEXT
      , "created" TEXT NOT NULL CONSTRAINT check_evaluation_trait_table_created_timestamp CHECK (created IS DATETIME (created))
      , "modified" TEXT NOT NULL CONSTRAINT check_evaluation_trait_table_modified_timestamp CHECK (modified IS DATETIME (modified))
      , CONSTRAINT fk_evaluation_trait_table_evaluation_trait_type_id FOREIGN KEY (id_evaluationtraittypeid) REFERENCES evaluation_trait_type_table (id_evaluationtraittypeid)
      , CONSTRAINT fk_evaluation_trait_table_units_type_id FOREIGN KEY (id_unitstypeid) REFERENCES units_type_table (id_unitstypeid)
      );
    
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('bb128c1e-de2d-4d33-aeca-9994f63ab427','Rectal Temperature','Temp','7079e750-9fc2-41e1-b46c-8505cdb8e67f',1,'8e827095-d519-4db8-ac18-56e502c34431','2024-09-13 11:16:18','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('b5865a35-f213-4b8a-9077-5472cd8a25b3','Body Condition Score','BCS','7079e750-9fc2-41e1-b46c-8505cdb8e67f',2,'49638d1d-b964-48bd-86ac-498930612bc8','2022-02-23 09:15:10','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('44d307ab-5c32-44c7-bb06-e65c11269716','Weight','Weight','7079e750-9fc2-41e1-b46c-8505cdb8e67f',3,'26a0a6c1-01a9-42f4-9601-53e9e03bde71','2022-02-23 09:15:10','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('e6fc96d2-c97e-4bb4-9a61-cbbc01b86ec0','FEC','FEC','7079e750-9fc2-41e1-b46c-8505cdb8e67f',4,'46101d80-0359-4c1c-a9f0-aa001fc29647','2022-02-23 09:15:10','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('cd3116a3-0a67-4a75-8b3e-0df038afed50','FEC Capillarid','Capillarid','7079e750-9fc2-41e1-b46c-8505cdb8e67f',5,'46101d80-0359-4c1c-a9f0-aa001fc29647','2022-02-23 09:15:10','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('0d9b98a3-6632-4bc6-9566-8fb4362c6c3d','FEC Eimeria','Eimeria','7079e750-9fc2-41e1-b46c-8505cdb8e67f',6,'46101d80-0359-4c1c-a9f0-aa001fc29647','2022-02-23 09:15:10','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('b5225cb9-a8c2-4440-ab93-b289b9c66230','FEC Moniezia','Moniezia','7079e750-9fc2-41e1-b46c-8505cdb8e67f',7,'46101d80-0359-4c1c-a9f0-aa001fc29647','2022-02-23 09:15:10','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('44e3efbb-33ca-42e5-9ec1-c891b15e1273','FEC Nematodirus','Nematodirus','7079e750-9fc2-41e1-b46c-8505cdb8e67f',8,'46101d80-0359-4c1c-a9f0-aa001fc29647','2022-02-23 09:15:10','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('cc477384-19c8-42f1-bbac-2a4ad24898f4','FEC Other','FEC Other','7079e750-9fc2-41e1-b46c-8505cdb8e67f',9,'46101d80-0359-4c1c-a9f0-aa001fc29647','2022-02-23 09:15:10','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('68117b62-e712-4155-beb4-39404fc3f2be','FEC Strongyles','Strongyles','7079e750-9fc2-41e1-b46c-8505cdb8e67f',10,'46101d80-0359-4c1c-a9f0-aa001fc29647','2022-02-23 09:15:10','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('367b7b4c-fd4a-4363-bc64-7b4a6045a918','FEC Strongyloides','Strongyloides','7079e750-9fc2-41e1-b46c-8505cdb8e67f',11,'46101d80-0359-4c1c-a9f0-aa001fc29647','2022-02-23 09:15:10','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('46236c86-979d-4ee9-a52c-21e8f95c382c','FEC Trichuris','Trichuris','7079e750-9fc2-41e1-b46c-8505cdb8e67f',12,'46101d80-0359-4c1c-a9f0-aa001fc29647','2022-02-23 09:15:10','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('be459431-f1b7-4c99-a044-d3baff3e3c46','Scrotal Circumference','Scrotal Circ','7079e750-9fc2-41e1-b46c-8505cdb8e67f',13,'b7bc82f7-c97d-4cbc-8c9f-bd5388f3e8a5','2022-02-23 09:15:10','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('4e462d47-c7a3-427c-a424-f9271918ac16','Sperm Morphology % Normal','Morph %','7079e750-9fc2-41e1-b46c-8505cdb8e67f',14,'2532d531-bea9-4315-80f0-f2ab0c088d90','2022-02-23 09:15:10','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('fa366b50-1980-409b-9934-f92bc1ffdead','Sperm Motility % Motile','Motility %','7079e750-9fc2-41e1-b46c-8505cdb8e67f',15,'2532d531-bea9-4315-80f0-f2ab0c088d90','2022-02-23 09:15:10','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('f4942e41-09d7-4c74-9d16-9dd45c840772','Fleece Average Fiber Diameter','AFD','7079e750-9fc2-41e1-b46c-8505cdb8e67f',16,'49638d1d-b964-48bd-86ac-498930612bc8','2025-12-04 05:54:36','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('cb398b20-6907-42c0-9cdc-9781517a38d3','Fleece Coefficient of Variation %','CV %','7079e750-9fc2-41e1-b46c-8505cdb8e67f',17,'2532d531-bea9-4315-80f0-f2ab0c088d90','2025-12-04 05:54:36','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('fb42c442-ebc9-4cc9-803a-ac94ea13b3ac','Fleece Comfort Factor %','CF %','7079e750-9fc2-41e1-b46c-8505cdb8e67f',18,'2532d531-bea9-4315-80f0-f2ab0c088d90','2025-12-04 05:54:36','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('275ddfba-a1c4-4b0a-b171-5a30142d9b9d','Fleece Length','FL','7079e750-9fc2-41e1-b46c-8505cdb8e67f',19,'b7bc82f7-c97d-4cbc-8c9f-bd5388f3e8a5','2022-02-23 09:15:10','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('4f9d7f18-c6cf-4ba7-8d6f-3b8b260631e5','Fleece Spin Fineness','SF','7079e750-9fc2-41e1-b46c-8505cdb8e67f',20,'49638d1d-b964-48bd-86ac-498930612bc8','2025-12-04 05:54:36','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('9fb1feaf-3be3-4f4f-9407-32b132cd4140','Fleece Standard Deviation','SD','7079e750-9fc2-41e1-b46c-8505cdb8e67f',21,'49638d1d-b964-48bd-86ac-498930612bc8','2025-12-04 05:54:36','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('644651d7-e3aa-41e2-8a2d-1fad7bcca493','Fleece Staple Length','SL','7079e750-9fc2-41e1-b46c-8505cdb8e67f',22,'49638d1d-b964-48bd-86ac-498930612bc8','2025-12-04 05:54:36','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('68fbba5c-3dbb-4f6c-a58c-9ff8b562e9f4','Fleece Coarse Edge Micron','CEM','7079e750-9fc2-41e1-b46c-8505cdb8e67f',23,'49638d1d-b964-48bd-86ac-498930612bc8','2025-12-04 05:54:36','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('72d877e6-3cfb-4b15-8c1b-00e8b13f4004','Fleece Curvature Ratio','CRV','7079e750-9fc2-41e1-b46c-8505cdb8e67f',24,'49638d1d-b964-48bd-86ac-498930612bc8','2025-12-04 05:54:36','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('f0dba60a-19c2-414b-a78d-1a2648c2f974','Fleece Weight','FW','7079e750-9fc2-41e1-b46c-8505cdb8e67f',25,'26a0a6c1-01a9-42f4-9601-53e9e03bde71','2022-02-23 09:15:10','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('84f35d50-d8e9-44e8-a62c-9c41f7394a40','Insemination Depth','Ins Depth','7079e750-9fc2-41e1-b46c-8505cdb8e67f',26,'b7bc82f7-c97d-4cbc-8c9f-bd5388f3e8a5','2022-02-23 09:15:10','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('3cf30d5f-8c59-4a44-8b0c-3fb162718532','Gestation Days Early','Ges Early','7079e750-9fc2-41e1-b46c-8505cdb8e67f',27,'2e55da17-1bd4-4178-a83b-5c1f2034d59e','2022-02-23 09:15:10','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('81498ee6-d640-4fa3-a0ee-6820708bc4a3','Gestation Days Late','Ges Late','7079e750-9fc2-41e1-b46c-8505cdb8e67f',28,'2e55da17-1bd4-4178-a83b-5c1f2034d59e','2022-02-23 09:15:10','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('3cc02aad-abd0-4061-a26e-f60799656853','B. ovis S/P ratios','S/P','7079e750-9fc2-41e1-b46c-8505cdb8e67f',29,'49638d1d-b964-48bd-86ac-498930612bc8','2023-10-01 15:30:00','2025-12-13 08:38:29');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('e0b238d5-e740-4662-8284-b4573c3570c1','Blood LH via ELISA Test','Blood LH','7079e750-9fc2-41e1-b46c-8505cdb8e67f',30,'49638d1d-b964-48bd-86ac-498930612bc8','2022-02-23 09:15:10','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('10953cf8-c67f-4b85-b2dd-441d57fe33dd','Loin Eye Muscle Depth Ultrasound','Loin Depth','7079e750-9fc2-41e1-b46c-8505cdb8e67f',31,'b7bc82f7-c97d-4cbc-8c9f-bd5388f3e8a5','2022-02-23 09:15:10','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('d071c11a-a4cc-4462-b50c-33bcee244759','Loin Fat Depth Ultrasound','Loin fat','7079e750-9fc2-41e1-b46c-8505cdb8e67f',32,'b7bc82f7-c97d-4cbc-8c9f-bd5388f3e8a5','2022-02-23 09:15:10','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('3092dd2e-43e7-49da-b583-bdbb164f6ab5','Loin Eye Area Ultrasound','Loin Area','7079e750-9fc2-41e1-b46c-8505cdb8e67f',33,'a026b938-b873-4b04-bae7-e7dcf1100a29','2022-02-23 09:15:10','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('d382fd09-ebb5-41d9-8e06-ae7a8e72e372','Width Hip to Hip Across Back','Hip Width','7079e750-9fc2-41e1-b46c-8505cdb8e67f',34,'b7bc82f7-c97d-4cbc-8c9f-bd5388f3e8a5','2022-02-23 09:15:10','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('0a39b244-7a44-4b1a-9211-5bbc07ced654','Body Length Poll to Pin Bone','BL Poll Pin','7079e750-9fc2-41e1-b46c-8505cdb8e67f',35,'b7bc82f7-c97d-4cbc-8c9f-bd5388f3e8a5','2022-02-23 09:15:10','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('0e42c5ac-51ba-4b72-909e-62e4c835aaeb','Body Length Point of Shoulder to Point of Hip','BL Shoulder Hip','7079e750-9fc2-41e1-b46c-8505cdb8e67f',36,'b7bc82f7-c97d-4cbc-8c9f-bd5388f3e8a5','2022-02-23 09:15:10','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('837ee73d-c608-4c00-881d-a92d372402e5','Heartgirth','Heartgirth','7079e750-9fc2-41e1-b46c-8505cdb8e67f',37,'b7bc82f7-c97d-4cbc-8c9f-bd5388f3e8a5','2022-02-23 09:15:10','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('1f603321-a363-4f03-ad4c-a4d8b4e592b2','Carcass Weight','Carcass','7079e750-9fc2-41e1-b46c-8505cdb8e67f',38,'26a0a6c1-01a9-42f4-9601-53e9e03bde71','2022-02-23 09:15:10','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('e6651a9e-bf91-45eb-93d6-e2b36d1edfec','Retail Meat Breast','Breast','7079e750-9fc2-41e1-b46c-8505cdb8e67f',39,'26a0a6c1-01a9-42f4-9601-53e9e03bde71','2024-08-24 11:36:27','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('d8fd75d7-5c04-418c-aaae-51e842014d42','Retail Meat French Rack','French Rack','7079e750-9fc2-41e1-b46c-8505cdb8e67f',40,'26a0a6c1-01a9-42f4-9601-53e9e03bde71','2024-08-24 11:36:27','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('e67e64f1-e01c-4e40-b605-36e18800c860','Retail Meat Ground','Ground','7079e750-9fc2-41e1-b46c-8505cdb8e67f',41,'26a0a6c1-01a9-42f4-9601-53e9e03bde71','2024-08-24 11:36:27','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('37ac151b-10b6-46e8-8242-5a190a360c90','Retail Meat Leg Bone In','Leg Bone','7079e750-9fc2-41e1-b46c-8505cdb8e67f',42,'26a0a6c1-01a9-42f4-9601-53e9e03bde71','2024-08-24 11:36:27','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('c3c4df7f-151a-4bbc-8321-b4b23addd21f','Retail Meat Leg Boneless','Leg Boneless','7079e750-9fc2-41e1-b46c-8505cdb8e67f',43,'26a0a6c1-01a9-42f4-9601-53e9e03bde71','2024-08-24 11:36:27','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('f969cb36-7bad-41f5-bb5c-a7564d9aba5a','Retail Meat Loin','Loin','7079e750-9fc2-41e1-b46c-8505cdb8e67f',44,'26a0a6c1-01a9-42f4-9601-53e9e03bde71','2024-08-24 11:36:27','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('c374d1cd-1b0b-4155-9638-360327ffcc5f','Retail Meat Neck','Neck','7079e750-9fc2-41e1-b46c-8505cdb8e67f',45,'26a0a6c1-01a9-42f4-9601-53e9e03bde71','2024-08-24 11:36:27','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('d2fd22bc-6040-416b-adec-83426256d1cc','Retail Meat Rib Chops','Rib Chops','7079e750-9fc2-41e1-b46c-8505cdb8e67f',46,'26a0a6c1-01a9-42f4-9601-53e9e03bde71','2024-08-24 11:36:27','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('daa5a4f0-b89b-4dfc-9da3-94df0e7882ab','Retail Meat Ribs','Ribs','7079e750-9fc2-41e1-b46c-8505cdb8e67f',47,'26a0a6c1-01a9-42f4-9601-53e9e03bde71','2024-08-24 11:36:27','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('a3ed0fbf-7056-49d4-8eb8-8a6ff7a9768e','Retail Meat Sausage Kolbasi','Kolbasi','7079e750-9fc2-41e1-b46c-8505cdb8e67f',48,'26a0a6c1-01a9-42f4-9601-53e9e03bde71','2024-08-24 11:36:27','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('d54fc12d-9c53-4ef4-9f53-8b13a633ed61','Retail Meat Sausage Sweet Italian','Sweet Italian','7079e750-9fc2-41e1-b46c-8505cdb8e67f',49,'26a0a6c1-01a9-42f4-9601-53e9e03bde71','2024-08-24 11:36:27','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('a7e459ae-1175-4acc-8ea6-981ef4b80772','Retail Meat Shank','Shank','7079e750-9fc2-41e1-b46c-8505cdb8e67f',50,'26a0a6c1-01a9-42f4-9601-53e9e03bde71','2024-08-24 11:36:27','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('c8809b52-14d8-4c97-a61d-2e52fc5a787b','Retail Meat Shoulder Boneless','Shoulder Boneless','7079e750-9fc2-41e1-b46c-8505cdb8e67f',51,'26a0a6c1-01a9-42f4-9601-53e9e03bde71','2024-08-24 11:36:27','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('845ddab0-702e-4ba6-b3f7-ce791faa90d9','Retail Meat Stew','Stew','7079e750-9fc2-41e1-b46c-8505cdb8e67f',52,'26a0a6c1-01a9-42f4-9601-53e9e03bde71','2024-08-24 11:36:27','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('920bce6b-cbe7-49e0-859b-9dcdb0a24d49','Retail Meat Total Weight','Retail Meat','7079e750-9fc2-41e1-b46c-8505cdb8e67f',53,'26a0a6c1-01a9-42f4-9601-53e9e03bde71','2024-08-24 11:36:27','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('9984d8dd-5d2e-45e9-ac92-576630cb01fc','FAMACHA','FAMACHA','79f17211-ea5d-44a5-a462-8607a5743b08',1,NULL,'2024-09-07 10:47:47','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('aedb6197-7e31-4cdb-975e-1ba0605a85fb','Teeth Alignment','Teeth Alignment','79f17211-ea5d-44a5-a462-8607a5743b08',2,NULL,'2022-02-23 09:15:10','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('08505284-9304-4f14-b3c5-6811d3fef54c','Teeth Missing','Teeth Missing','79f17211-ea5d-44a5-a462-8607a5743b08',3,NULL,'2022-02-23 09:15:10','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('c5631f34-e906-483f-9f11-ac5b74682450','Teeth Shape','Teeth Shape','79f17211-ea5d-44a5-a462-8607a5743b08',4,NULL,'2024-12-17 09:49:24','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('3100171d-1e6e-4db6-9316-b9188e75cc8a','White on Nose','White Nose','79f17211-ea5d-44a5-a462-8607a5743b08',5,NULL,'2022-02-23 09:15:10','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('127b277f-558a-435c-b323-a4b740bea3e8','Head','Head','79f17211-ea5d-44a5-a462-8607a5743b08',6,NULL,'2022-02-23 09:15:10','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('d2e20574-0c8e-44d7-9234-7861c8474a55','Horn Shape','Horn Shape','79f17211-ea5d-44a5-a462-8607a5743b08',7,NULL,'2022-02-23 09:15:10','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('6331f806-ff2a-4a12-b2e1-243723e3022d','Horn Buds','Horn Buds','79f17211-ea5d-44a5-a462-8607a5743b08',8,NULL,'2022-02-23 09:15:10','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('a301e64d-55b2-4af8-8ba8-abe7998102b4','Body','Body','79f17211-ea5d-44a5-a462-8607a5743b08',9,NULL,'2022-02-23 09:15:10','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('d1c3e8d7-87a9-42d5-8971-3ae8529e5022','Legs','Legs','79f17211-ea5d-44a5-a462-8607a5743b08',10,NULL,'2022-02-23 09:15:10','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('81085936-f338-421d-9e16-e2dab0aee9d2','Udder Lumps','Udder Lumps','79f17211-ea5d-44a5-a462-8607a5743b08',11,NULL,'2022-02-23 09:15:10','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('7bd2a8af-faa5-414d-ac3c-12bd7a94b748','White in Britch or Body','White Britch','79f17211-ea5d-44a5-a462-8607a5743b08',12,NULL,'2022-02-23 09:15:10','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('3456c7f5-e293-4525-a1a1-b8a05d52e911','Mothering Ability','Mothering','79f17211-ea5d-44a5-a462-8607a5743b08',13,NULL,'2022-02-23 09:15:10','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('8f111fe6-39d4-4532-a19d-9ca4625dfce5','Fleece Quality','FQ','79f17211-ea5d-44a5-a462-8607a5743b08',14,NULL,'2022-02-23 09:15:10','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('1425fe44-d99b-485d-a8ea-af627431ad5c','Fleece Soft','FS','79f17211-ea5d-44a5-a462-8607a5743b08',15,NULL,'2022-02-23 09:15:10','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('6a0f4c54-06e7-49a6-9715-6624e2faf1ea','Fleece Crimp','FC','79f17211-ea5d-44a5-a462-8607a5743b08',16,NULL,'2022-02-23 09:15:10','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('780386a4-33ce-4e62-92d7-9372c15471f4','Tail Length','Tail','79f17211-ea5d-44a5-a462-8607a5743b08',17,NULL,'2022-02-23 09:15:10','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('ee2d69d4-40d9-4bee-9248-eb439308788e','Temperament','Temperament','79f17211-ea5d-44a5-a462-8607a5743b08',18,NULL,'2022-02-23 09:15:10','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('619ffe00-86d8-4aa8-960f-141ed111092f','General Health','Health','79f17211-ea5d-44a5-a462-8607a5743b08',19,NULL,'2024-11-25 15:24:41','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('2046720b-c03b-4640-8e57-2eaf31e05b53','Number of Lambs Expected','# Lambs','79f17211-ea5d-44a5-a462-8607a5743b08',20,NULL,'2022-02-23 09:15:10','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('bd0925b6-bf1d-4ac8-a275-7ba6da122d41','Wether Lambs Born','Wether Lambs','79f17211-ea5d-44a5-a462-8607a5743b08',21,NULL,'2023-04-02 16:18:34','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('923ee982-d1b4-4968-a9f0-9aed7126abc2','Ewe Lambs Born','Ewe Lambs','79f17211-ea5d-44a5-a462-8607a5743b08',22,NULL,'2023-04-02 16:18:34','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('968eae00-3c84-43bd-ab91-ce19246c2f79','Ram Lambs Born','Ram Lambs','79f17211-ea5d-44a5-a462-8607a5743b08',23,NULL,'2023-04-02 16:18:34','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('601f910c-33fa-4894-87ae-9eff9f7d4b9e','Unknown Sex Lambs Born','Unknown Lambs','79f17211-ea5d-44a5-a462-8607a5743b08',24,NULL,'2023-08-11 11:06:33','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('5f6f1a22-756c-4b12-8be3-4e2fd7d17fb5','Stillborn Lambs','Stillborn Lambs','79f17211-ea5d-44a5-a462-8607a5743b08',25,NULL,'2023-04-02 16:18:34','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('8644a896-c70c-463e-a3bd-12e7ae0e0a38','Aborted Lambs','Aborted Lambs','79f17211-ea5d-44a5-a462-8607a5743b08',26,NULL,'2023-07-18 10:37:19','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('2b5e739c-06c8-4e24-915f-ba2484ffaa8e','Adopted Lambs','Adopted Lambs','79f17211-ea5d-44a5-a462-8607a5743b08',27,NULL,'2023-08-11 11:06:33','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('e49cb696-41ec-462e-9bd1-7ed0e1960d79','Male Animals Born','Male Born','79f17211-ea5d-44a5-a462-8607a5743b08',28,NULL,'2022-02-23 09:15:10','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('391b2b69-4976-426d-ba3b-2911bc5a8f2a','Female Animals Born','Female Born','79f17211-ea5d-44a5-a462-8607a5743b08',29,NULL,'2022-02-23 09:15:10','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('7065f88c-ee13-4682-8795-c9c14a65b1f4','Unknown Sex Animals Born','Unknown Born','79f17211-ea5d-44a5-a462-8607a5743b08',30,NULL,'2022-02-23 09:15:10','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('8a2a31ee-8b85-4ca5-9ca5-176766e3ee71','Stillborn Animals','Stillborn','79f17211-ea5d-44a5-a462-8607a5743b08',31,NULL,'2022-02-23 09:15:10','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('fd29996f-fb9e-4ed4-95fd-47cea9963fa0','Ewe Birth Ease','Ewe Birth Ease','79f17211-ea5d-44a5-a462-8607a5743b08',32,NULL,'2025-04-24 16:08:26','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('4088e404-d30c-4765-b2b7-bfa4cf02c199','Extra Nipples','Extra Nipples','79f17211-ea5d-44a5-a462-8607a5743b08',33,NULL,'2024-12-11 15:53:38','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('58f8290b-058d-4307-86dd-33b0c0407f6b','Horn Width','Horn Width','79f17211-ea5d-44a5-a462-8607a5743b08',34,NULL,'2025-01-12 08:07:47','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('262de734-24fe-4fb4-9026-a444f1c94e1d','Scrotal Palpation Scored','Scrotal Scored','79f17211-ea5d-44a5-a462-8607a5743b08',35,NULL,'2022-02-23 09:15:10','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('0de3d707-59ad-4261-8f93-f4cd86480347','SubOrbital Pit Size','SO Pit Size','79f17211-ea5d-44a5-a462-8607a5743b08',36,NULL,'2024-12-11 15:53:38','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('2d79d6c3-a096-40db-ae4a-2dfa18d05482','Optimal Livestock Ram Test','Ram BSE','abfb56ad-52a4-4e3e-99f5-19e8582f228f',1,NULL,'2022-02-23 09:15:10','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('0c96e6f7-eb2e-406f-b639-d7d505f7ee3a','Scrotal Palpation Custom','Scrotal Custom','abfb56ad-52a4-4e3e-99f5-19e8582f228f',2,NULL,'2024-08-24 11:36:27','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('a11275e7-0eeb-4e9f-b7dd-2adbb361ccfb','Simple Sort','Sort','abfb56ad-52a4-4e3e-99f5-19e8582f228f',3,NULL,'2022-02-23 09:15:10','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('d8127b75-6dfe-49c5-9cef-77d79d44e07d','Breeding Soundness Exam','BSE','abfb56ad-52a4-4e3e-99f5-19e8582f228f',4,NULL,'2022-02-23 09:15:10','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('72a721eb-9738-4023-b910-93af6e33386d','Pregnancy Status','Preg','abfb56ad-52a4-4e3e-99f5-19e8582f228f',5,NULL,'2022-02-23 09:15:10','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('bafda80d-d004-400b-9fca-f97d609fd62c','Udder Status','Udder','abfb56ad-52a4-4e3e-99f5-19e8582f228f',6,NULL,'2022-02-23 09:15:10','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('f8e01215-e228-45d7-ac1a-cd7b1ff8419f','Estrus Characteristics','Estrus','abfb56ad-52a4-4e3e-99f5-19e8582f228f',7,NULL,'2022-02-23 09:15:10','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('5e372585-ce1d-4bb6-893a-c765b915b882','LambEase','LambEase','abfb56ad-52a4-4e3e-99f5-19e8582f228f',8,NULL,'2022-02-23 09:15:10','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('c00505e5-9d8b-48d6-b6fd-84cdb3c65127','Suck Reflex','Suck','abfb56ad-52a4-4e3e-99f5-19e8582f228f',9,NULL,'2022-02-23 09:15:10','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('a38a8c05-9c4c-46a5-8bb5-c3398b8b8c94','Fleece Color','FCol','abfb56ad-52a4-4e3e-99f5-19e8582f228f',10,NULL,'2023-08-14 12:59:43','2025-12-04 05:54:36');
    INSERT INTO evaluation_trait_table(id_evaluationtraitid,trait_name,trait_abbrev,id_evaluationtraittypeid,evaluation_trait_display_order,id_unitstypeid,created,modified) VALUES ('1c2ac0b8-9ac5-4cfb-8582-00ac0fbf3f53','FFSSA Grade','Grade','abfb56ad-52a4-4e3e-99f5-19e8582f228f',11,NULL,'2025-12-04 05:54:36','2025-12-04 05:54:36');
    
    --------------------------------------------------------------------------------------
    -- Update custom_evaluation_traits_table with columns, constraints, and seed values
    --------------------------------------------------------------------------------------
    
    DROP TABLE IF EXISTS custom_evaluation_traits_table;
    
    CREATE TABLE "custom_evaluation_traits_table" 
      ("id_customevaluationtraitsid" TEXT PRIMARY KEY
      , "id_evaluationtraitid" TEXT NOT NULL
      , "custom_evaluation_item" TEXT NOT NULL
      , "custom_evaluation_abbrev" TEXT NOT NULL
      , "custom_evaluation_order" INTEGER NOT NULL
      , "created" TEXT NOT NULL CONSTRAINT check_custom_evaluation_traits_table_created_timestamp CHECK (created IS DATETIME (created))
      , "modified" TEXT NOT NULL CONSTRAINT check_custom_evaluation_traits_table_modified_timestamp CHECK (modified IS DATETIME (modified))
      , CONSTRAINT fk_custom_evaluation_traits_table_evaluation_trait_id FOREIGN KEY (id_evaluationtraitid) REFERENCES evaluation_trait_table (id_evaluationtraitid)
      , CONSTRAINT unique_custom_evaluation_traits_table_evaluation_trait_id_and_custom_evaluation_item_and_custom_evaluation_abbrev UNIQUE(id_evaluationtraitid, custom_evaluation_item, custom_evaluation_abbrev)
      );
    
    -- Table has been dropped so it is safe to insert these seed values.
    
    INSERT INTO custom_evaluation_traits_table(id_customevaluationtraitsid,id_evaluationtraitid,custom_evaluation_item,custom_evaluation_abbrev,custom_evaluation_order,created,modified) VALUES ('8a67915a-7f98-4809-ae3c-419dde1dffe7','f8e01215-e228-45d7-ac1a-cd7b1ff8419f','Engorged Vulva','Engorged',2,'2023-04-14 21:22:42','2025-12-04 05:54:36');
    INSERT INTO custom_evaluation_traits_table(id_customevaluationtraitsid,id_evaluationtraitid,custom_evaluation_item,custom_evaluation_abbrev,custom_evaluation_order,created,modified) VALUES ('7525268b-3847-4cb0-8328-bcc85f3346de','f8e01215-e228-45d7-ac1a-cd7b1ff8419f','Mucus Present','Mucus',3,'2023-04-14 21:22:42','2025-12-04 05:54:36');
    INSERT INTO custom_evaluation_traits_table(id_customevaluationtraitsid,id_evaluationtraitid,custom_evaluation_item,custom_evaluation_abbrev,custom_evaluation_order,created,modified) VALUES ('98830d78-d1f1-451d-83e3-2c05a45add9e','f8e01215-e228-45d7-ac1a-cd7b1ff8419f','Both Engorged Vulva & Mucus','Engorged & Mucus',4,'2023-04-14 21:22:42','2025-12-04 05:54:36');
    INSERT INTO custom_evaluation_traits_table(id_customevaluationtraitsid,id_evaluationtraitid,custom_evaluation_item,custom_evaluation_abbrev,custom_evaluation_order,created,modified) VALUES ('53ce5393-f389-47ec-808c-832837f72f19','f8e01215-e228-45d7-ac1a-cd7b1ff8419f','Neither Engorged Vulva & Mucus','Not Engorged or Mucus',1,'2023-04-14 21:22:42','2025-12-04 05:54:36');
    INSERT INTO custom_evaluation_traits_table(id_customevaluationtraitsid,id_evaluationtraitid,custom_evaluation_item,custom_evaluation_abbrev,custom_evaluation_order,created,modified) VALUES ('62da608e-47fc-43e3-a40d-cd11b8fa50bd','72a721eb-9738-4023-b910-93af6e33386d','Pregnant','Preg',1,'2023-04-14 21:22:42','2025-12-04 05:54:36');
    INSERT INTO custom_evaluation_traits_table(id_customevaluationtraitsid,id_evaluationtraitid,custom_evaluation_item,custom_evaluation_abbrev,custom_evaluation_order,created,modified) VALUES ('684d3420-d62d-4529-a738-7a9d70270e54','72a721eb-9738-4023-b910-93af6e33386d','Unsure','Maybe',2,'2023-04-14 21:22:42','2025-12-04 05:54:36');
    INSERT INTO custom_evaluation_traits_table(id_customevaluationtraitsid,id_evaluationtraitid,custom_evaluation_item,custom_evaluation_abbrev,custom_evaluation_order,created,modified) VALUES ('5749d153-d1cf-41d3-9696-2bfa984d6e9a','72a721eb-9738-4023-b910-93af6e33386d','Not Pregnant','Not Preg',3,'2023-04-14 21:22:42','2025-12-04 05:54:36');
    INSERT INTO custom_evaluation_traits_table(id_customevaluationtraitsid,id_evaluationtraitid,custom_evaluation_item,custom_evaluation_abbrev,custom_evaluation_order,created,modified) VALUES ('0335479a-56d1-4425-b9fa-b2f569b099ed','72a721eb-9738-4023-b910-93af6e33386d','Not Scanned','No Scan',4,'2023-04-14 21:22:42','2025-12-04 05:54:36');
    INSERT INTO custom_evaluation_traits_table(id_customevaluationtraitsid,id_evaluationtraitid,custom_evaluation_item,custom_evaluation_abbrev,custom_evaluation_order,created,modified) VALUES ('fa4b9e07-68a1-449f-bc19-a69a7a3bd30d','5e372585-ce1d-4bb6-893a-c765b915b882','Unassisted','Unassisted',1,'2023-04-14 21:22:42','2025-12-04 05:54:36');
    INSERT INTO custom_evaluation_traits_table(id_customevaluationtraitsid,id_evaluationtraitid,custom_evaluation_item,custom_evaluation_abbrev,custom_evaluation_order,created,modified) VALUES ('49b61002-6d12-4a88-ab1d-5f77fb52a8c8','5e372585-ce1d-4bb6-893a-c765b915b882','Easy Pull','Easy Pull',2,'2023-04-14 21:22:42','2025-12-04 05:54:36');
    INSERT INTO custom_evaluation_traits_table(id_customevaluationtraitsid,id_evaluationtraitid,custom_evaluation_item,custom_evaluation_abbrev,custom_evaluation_order,created,modified) VALUES ('5549d370-19ea-4371-a1ca-e4555a0a2995','5e372585-ce1d-4bb6-893a-c765b915b882','Hard Pull','Hard Pull',3,'2023-04-14 21:22:42','2025-12-04 05:54:36');
    INSERT INTO custom_evaluation_traits_table(id_customevaluationtraitsid,id_evaluationtraitid,custom_evaluation_item,custom_evaluation_abbrev,custom_evaluation_order,created,modified) VALUES ('f3415ee7-2acc-4c98-86d6-837395cd601b','5e372585-ce1d-4bb6-893a-c765b915b882','Malpresentation','Malpresentation',4,'2023-04-14 21:22:42','2025-12-04 05:54:36');
    INSERT INTO custom_evaluation_traits_table(id_customevaluationtraitsid,id_evaluationtraitid,custom_evaluation_item,custom_evaluation_abbrev,custom_evaluation_order,created,modified) VALUES ('8d6f488a-b8b4-4e30-bb70-38d09e2fe825','5e372585-ce1d-4bb6-893a-c765b915b882','Veterinary Assistance','Vet',5,'2023-04-14 21:22:42','2025-12-04 05:54:36');
    INSERT INTO custom_evaluation_traits_table(id_customevaluationtraitsid,id_evaluationtraitid,custom_evaluation_item,custom_evaluation_abbrev,custom_evaluation_order,created,modified) VALUES ('bd51ab7b-98e6-4116-b7e7-229f925531cc','bafda80d-d004-400b-9fca-f97d609fd62c','No Udder','No Udder',1,'2023-04-14 21:22:42','2025-12-04 05:54:36');
    INSERT INTO custom_evaluation_traits_table(id_customevaluationtraitsid,id_evaluationtraitid,custom_evaluation_item,custom_evaluation_abbrev,custom_evaluation_order,created,modified) VALUES ('0f657f75-210e-4e15-a98e-78dc23f9db8d','bafda80d-d004-400b-9fca-f97d609fd62c','Small Udder','Small Udder',2,'2023-04-14 21:22:42','2025-12-04 05:54:36');
    INSERT INTO custom_evaluation_traits_table(id_customevaluationtraitsid,id_evaluationtraitid,custom_evaluation_item,custom_evaluation_abbrev,custom_evaluation_order,created,modified) VALUES ('555c75b1-660d-4a6d-a00f-2ac12130e322','bafda80d-d004-400b-9fca-f97d609fd62c','Medium Udder','Medium Udder',3,'2023-04-14 21:22:42','2025-12-04 05:54:36');
    INSERT INTO custom_evaluation_traits_table(id_customevaluationtraitsid,id_evaluationtraitid,custom_evaluation_item,custom_evaluation_abbrev,custom_evaluation_order,created,modified) VALUES ('42d87e9d-be41-4296-bd2f-fb7e36030f2b','bafda80d-d004-400b-9fca-f97d609fd62c','Large Udder','Large Udder',4,'2023-04-14 21:22:42','2025-12-04 05:54:36');
    INSERT INTO custom_evaluation_traits_table(id_customevaluationtraitsid,id_evaluationtraitid,custom_evaluation_item,custom_evaluation_abbrev,custom_evaluation_order,created,modified) VALUES ('ff497d06-c288-4978-b75b-5862451796c5','c00505e5-9d8b-48d6-b6fd-84cdb3c65127','Not Tested','Not Tested',1,'2023-04-14 21:22:42','2025-12-04 05:54:36');
    INSERT INTO custom_evaluation_traits_table(id_customevaluationtraitsid,id_evaluationtraitid,custom_evaluation_item,custom_evaluation_abbrev,custom_evaluation_order,created,modified) VALUES ('ccd30208-c613-4fea-80ee-37f801e1a0f4','c00505e5-9d8b-48d6-b6fd-84cdb3c65127','No Suck','No Suck',2,'2023-04-14 21:22:42','2025-12-04 05:54:36');
    INSERT INTO custom_evaluation_traits_table(id_customevaluationtraitsid,id_evaluationtraitid,custom_evaluation_item,custom_evaluation_abbrev,custom_evaluation_order,created,modified) VALUES ('299a716c-4597-4dff-8a88-7980e7ce36d0','c00505e5-9d8b-48d6-b6fd-84cdb3c65127','Poor Suck','Poor Suck',3,'2023-04-14 21:22:42','2025-12-04 05:54:36');
    INSERT INTO custom_evaluation_traits_table(id_customevaluationtraitsid,id_evaluationtraitid,custom_evaluation_item,custom_evaluation_abbrev,custom_evaluation_order,created,modified) VALUES ('7080f1e1-8ab4-44fd-9134-d9226708d66b','c00505e5-9d8b-48d6-b6fd-84cdb3c65127','Great Suck','Great Suck',5,'2023-04-14 21:22:42','2025-12-04 05:54:36');
    INSERT INTO custom_evaluation_traits_table(id_customevaluationtraitsid,id_evaluationtraitid,custom_evaluation_item,custom_evaluation_abbrev,custom_evaluation_order,created,modified) VALUES ('5363286e-ea26-4c31-89d0-5543ebaec427','c00505e5-9d8b-48d6-b6fd-84cdb3c65127','Good Suck','Good Suck',4,'2023-04-14 21:22:42','2025-12-04 05:54:36');
    INSERT INTO custom_evaluation_traits_table(id_customevaluationtraitsid,id_evaluationtraitid,custom_evaluation_item,custom_evaluation_abbrev,custom_evaluation_order,created,modified) VALUES ('40989080-2601-4c3d-b782-98d330cf5510','d8127b75-6dfe-49c5-9cef-77d79d44e07d','BSE Satisfactory','BSE S',1,'2023-04-14 21:22:42','2025-12-04 05:54:36');
    INSERT INTO custom_evaluation_traits_table(id_customevaluationtraitsid,id_evaluationtraitid,custom_evaluation_item,custom_evaluation_abbrev,custom_evaluation_order,created,modified) VALUES ('4a489a4f-7586-4105-a243-35fca93f2535','d8127b75-6dfe-49c5-9cef-77d79d44e07d','BSE Unsatisfactory','BSE U',2,'2023-04-14 21:22:42','2025-12-04 05:54:36');
    INSERT INTO custom_evaluation_traits_table(id_customevaluationtraitsid,id_evaluationtraitid,custom_evaluation_item,custom_evaluation_abbrev,custom_evaluation_order,created,modified) VALUES ('e3339ffe-3448-417c-9576-bb1f36551d99','d8127b75-6dfe-49c5-9cef-77d79d44e07d','BSE Recheck','BSE R',3,'2023-04-14 21:22:42','2025-12-04 05:54:36');
    INSERT INTO custom_evaluation_traits_table(id_customevaluationtraitsid,id_evaluationtraitid,custom_evaluation_item,custom_evaluation_abbrev,custom_evaluation_order,created,modified) VALUES ('e0115229-d0ef-4f54-aeac-de27efba68dd','a38a8c05-9c4c-46a5-8bb5-c3398b8b8c94','Black','Black',1,'2023-04-14 21:22:42','2025-12-04 05:54:36');
    INSERT INTO custom_evaluation_traits_table(id_customevaluationtraitsid,id_evaluationtraitid,custom_evaluation_item,custom_evaluation_abbrev,custom_evaluation_order,created,modified) VALUES ('57bdb256-e116-49a1-83dd-fbf1de4ee674','a38a8c05-9c4c-46a5-8bb5-c3398b8b8c94','White','White',3,'2023-04-14 21:22:42','2025-12-04 05:54:36');
    INSERT INTO custom_evaluation_traits_table(id_customevaluationtraitsid,id_evaluationtraitid,custom_evaluation_item,custom_evaluation_abbrev,custom_evaluation_order,created,modified) VALUES ('2b27068e-d216-4d12-a602-ae7f18b0d1ef','a38a8c05-9c4c-46a5-8bb5-c3398b8b8c94','Badger Face','Badger Face',4,'2023-04-14 21:22:42','2025-12-04 05:54:36');
    INSERT INTO custom_evaluation_traits_table(id_customevaluationtraitsid,id_evaluationtraitid,custom_evaluation_item,custom_evaluation_abbrev,custom_evaluation_order,created,modified) VALUES ('fb747a85-224b-4636-b930-516accbe24be','a38a8c05-9c4c-46a5-8bb5-c3398b8b8c94','Chocolate','Chocolate',2,'2023-04-14 21:22:42','2025-12-04 05:54:36');
    INSERT INTO custom_evaluation_traits_table(id_customevaluationtraitsid,id_evaluationtraitid,custom_evaluation_item,custom_evaluation_abbrev,custom_evaluation_order,created,modified) VALUES ('64b79ac7-6eb0-4332-8246-c7e7ea9003df','2d79d6c3-a096-40db-ae4a-2dfa18d05482','OL Ram BSE Excellent','R BSE E',1,'2023-08-26 08:50:50','2025-12-04 05:54:36');
    INSERT INTO custom_evaluation_traits_table(id_customevaluationtraitsid,id_evaluationtraitid,custom_evaluation_item,custom_evaluation_abbrev,custom_evaluation_order,created,modified) VALUES ('06200319-4807-49fa-a6c9-4b48305cc059','2d79d6c3-a096-40db-ae4a-2dfa18d05482','OL Ram BSE Satisfactory','R BSE S',2,'2023-08-26 08:50:50','2025-12-04 05:54:36');
    INSERT INTO custom_evaluation_traits_table(id_customevaluationtraitsid,id_evaluationtraitid,custom_evaluation_item,custom_evaluation_abbrev,custom_evaluation_order,created,modified) VALUES ('2a6647e6-b29e-4240-8363-58fd008fbd6b','2d79d6c3-a096-40db-ae4a-2dfa18d05482','OL Ram BSE Questionable','R BSE Q',3,'2023-08-26 08:50:50','2025-12-04 05:54:36');
    INSERT INTO custom_evaluation_traits_table(id_customevaluationtraitsid,id_evaluationtraitid,custom_evaluation_item,custom_evaluation_abbrev,custom_evaluation_order,created,modified) VALUES ('0a56cbee-b55d-45ee-9e7b-68c287f62d4e','2d79d6c3-a096-40db-ae4a-2dfa18d05482','OL Ram BSE Unsatisfactory','R BSE U',4,'2023-08-26 08:50:50','2025-12-04 05:54:36');
    INSERT INTO custom_evaluation_traits_table(id_customevaluationtraitsid,id_evaluationtraitid,custom_evaluation_item,custom_evaluation_abbrev,custom_evaluation_order,created,modified) VALUES ('aac8b648-ceac-451b-87ee-69582e778af3','a11275e7-0eeb-4e9f-b7dd-2adbb361ccfb','Keep','Keep',1,'2023-08-26 08:50:50','2025-12-04 05:54:36');
    INSERT INTO custom_evaluation_traits_table(id_customevaluationtraitsid,id_evaluationtraitid,custom_evaluation_item,custom_evaluation_abbrev,custom_evaluation_order,created,modified) VALUES ('13c72929-b2fb-4873-b95f-78d689deffb6','a11275e7-0eeb-4e9f-b7dd-2adbb361ccfb','Ship','Ship',2,'2023-08-26 08:50:50','2025-12-04 05:54:36');
    INSERT INTO custom_evaluation_traits_table(id_customevaluationtraitsid,id_evaluationtraitid,custom_evaluation_item,custom_evaluation_abbrev,custom_evaluation_order,created,modified) VALUES ('11459d3b-a712-4e31-bc80-0acc85301bcf','a11275e7-0eeb-4e9f-b7dd-2adbb361ccfb','Cull','Cull',3,'2023-09-13 15:58:00','2025-12-04 05:54:36');
    INSERT INTO custom_evaluation_traits_table(id_customevaluationtraitsid,id_evaluationtraitid,custom_evaluation_item,custom_evaluation_abbrev,custom_evaluation_order,created,modified) VALUES ('3aafef14-46f5-4f92-949a-57110101d19f','a11275e7-0eeb-4e9f-b7dd-2adbb361ccfb','Other','Other',4,'2023-09-13 15:58:00','2025-12-04 05:54:36');
    INSERT INTO custom_evaluation_traits_table(id_customevaluationtraitsid,id_evaluationtraitid,custom_evaluation_item,custom_evaluation_abbrev,custom_evaluation_order,created,modified) VALUES ('e8f24d07-50e9-448f-a44d-95ca2656f679','0c96e6f7-eb2e-406f-b639-d7d505f7ee3a','Scrotal Palp Satisfactory','Scrotal S',1,'2024-07-14 09:41:16','2025-12-04 05:54:36');
    INSERT INTO custom_evaluation_traits_table(id_customevaluationtraitsid,id_evaluationtraitid,custom_evaluation_item,custom_evaluation_abbrev,custom_evaluation_order,created,modified) VALUES ('d061f696-bcf4-4e1e-93f1-ea3029011f44','0c96e6f7-eb2e-406f-b639-d7d505f7ee3a','Scrotal Palp Unsatisfactory','Scrotal U',2,'2024-07-14 09:41:16','2025-12-04 05:54:36');
    INSERT INTO custom_evaluation_traits_table(id_customevaluationtraitsid,id_evaluationtraitid,custom_evaluation_item,custom_evaluation_abbrev,custom_evaluation_order,created,modified) VALUES ('2731f09a-e2ea-42c0-8206-07d3acf29176','0c96e6f7-eb2e-406f-b639-d7d505f7ee3a','Scrotal Palp Not Checked','Scrotal ?',3,'2024-07-14 09:41:16','2025-12-04 05:54:36');
    INSERT INTO custom_evaluation_traits_table(id_customevaluationtraitsid,id_evaluationtraitid,custom_evaluation_item,custom_evaluation_abbrev,custom_evaluation_order,created,modified) VALUES ('ecce51ca-5ee6-43db-8cf3-a32811e6afb4','1c2ac0b8-9ac5-4cfb-8582-00ac0fbf3f53','Superfine Premium Grade 1','PG1',1,'2025-12-04 05:54:36','2025-12-04 05:54:36');
    INSERT INTO custom_evaluation_traits_table(id_customevaluationtraitsid,id_evaluationtraitid,custom_evaluation_item,custom_evaluation_abbrev,custom_evaluation_order,created,modified) VALUES ('2340dd90-34fa-47df-ba52-7a04bfbfc264','1c2ac0b8-9ac5-4cfb-8582-00ac0fbf3f53','Superfine Grade 1','G1',2,'2025-12-04 05:54:36','2025-12-04 05:54:36');
    INSERT INTO custom_evaluation_traits_table(id_customevaluationtraitsid,id_evaluationtraitid,custom_evaluation_item,custom_evaluation_abbrev,custom_evaluation_order,created,modified) VALUES ('94428c32-2842-4d34-9bdc-db5c8a7fbc7e','1c2ac0b8-9ac5-4cfb-8582-00ac0fbf3f53','Fine Premium Grade 2','PG2',3,'2025-12-04 05:54:36','2025-12-04 05:54:36');
    INSERT INTO custom_evaluation_traits_table(id_customevaluationtraitsid,id_evaluationtraitid,custom_evaluation_item,custom_evaluation_abbrev,custom_evaluation_order,created,modified) VALUES ('29acc0ec-d71e-48af-8a6b-00d36ef619fd','1c2ac0b8-9ac5-4cfb-8582-00ac0fbf3f53','Fine Grade 2','G2',4,'2025-12-04 05:54:36','2025-12-04 05:54:36');
    INSERT INTO custom_evaluation_traits_table(id_customevaluationtraitsid,id_evaluationtraitid,custom_evaluation_item,custom_evaluation_abbrev,custom_evaluation_order,created,modified) VALUES ('90796e14-f4d4-4570-a271-056df21a5d2e','1c2ac0b8-9ac5-4cfb-8582-00ac0fbf3f53','Good Grade 3','G3',5,'2025-12-04 05:54:36','2025-12-04 05:54:36');
    INSERT INTO custom_evaluation_traits_table(id_customevaluationtraitsid,id_evaluationtraitid,custom_evaluation_item,custom_evaluation_abbrev,custom_evaluation_order,created,modified) VALUES ('e9333b53-adb7-483a-9c8a-827d840481d7','1c2ac0b8-9ac5-4cfb-8582-00ac0fbf3f53','Heavy Grade 4','G4',6,'2025-12-04 05:54:36','2025-12-04 05:54:36');
    INSERT INTO custom_evaluation_traits_table(id_customevaluationtraitsid,id_evaluationtraitid,custom_evaluation_item,custom_evaluation_abbrev,custom_evaluation_order,created,modified) VALUES ('416f9ab4-0c7a-405d-be48-de518b610ecf','1c2ac0b8-9ac5-4cfb-8582-00ac0fbf3f53','Rough Grade 5','G5',7,'2025-12-04 05:54:36','2025-12-04 05:54:36');
    
    --------------------------------------------------------------------------------------
    -- Add genetic_coat_marking_table and seed data
    --------------------------------------------------------------------------------------
    
    CREATE TABLE IF NOT EXISTS "genetic_coat_marking_table" 
      ("id_geneticcoatmarkingid" TEXT PRIMARY KEY
      , "id_registry_id_companyid" TEXT NOT NULL 
      , "coat_marking" TEXT NOT NULL
      , "coat_marking_abbrev" TEXT NOT NULL
      , "coat_marking_display_order" INTEGER NOT NULL
      , "created" TEXT NOT NULL CHECK (created IS DATETIME (created))
      , "modified" TEXT NOT NULL CHECK (modified IS DATETIME (modified))
      , FOREIGN KEY (id_registry_id_companyid) REFERENCES company_table (id_companyid)
      , UNIQUE(id_registry_id_companyid, coat_marking)
      , UNIQUE(id_registry_id_companyid, coat_marking_abbrev)
      );
    
    -- Do nothing on conflicts here as the table is new and we are only interested in idempotence for the script.
    
    INSERT INTO genetic_coat_marking_table(id_geneticcoatmarkingid,id_registry_id_companyid,coat_marking,coat_marking_abbrev,coat_marking_display_order,created,modified) 
    VALUES ('59106e8f-9f83-4398-8918-9b2c58530ce0','ff8c7427-e235-4d5a-b218-00767ef8ae1b','Bersugget','BERS',1,'2025-12-13 07:33:52','2025-12-13 07:33:52')
    ON CONFLICT(id_geneticcoatmarkingid) DO NOTHING;
    
    INSERT INTO genetic_coat_marking_table(id_geneticcoatmarkingid,id_registry_id_companyid,coat_marking,coat_marking_abbrev,coat_marking_display_order,created,modified) 
    VALUES ('4fb16a20-0856-4d8e-ad4d-3470ef2bb5b1','ff8c7427-e235-4d5a-b218-00767ef8ae1b','Burrit','BURR',2,'2025-12-13 07:33:52','2025-12-13 07:33:52')
    ON CONFLICT(id_geneticcoatmarkingid) DO NOTHING;
    
    INSERT INTO genetic_coat_marking_table(id_geneticcoatmarkingid,id_registry_id_companyid,coat_marking,coat_marking_abbrev,coat_marking_display_order,created,modified) 
    VALUES ('c4c633ae-2089-4d00-9a99-99930cbcb9c0','ff8c7427-e235-4d5a-b218-00767ef8ae1b','Flecket','FLEC',3,'2025-12-13 07:33:52','2025-12-13 07:33:52')
    ON CONFLICT(id_geneticcoatmarkingid) DO NOTHING;
    
    INSERT INTO genetic_coat_marking_table(id_geneticcoatmarkingid,id_registry_id_companyid,coat_marking,coat_marking_abbrev,coat_marking_display_order,created,modified) 
    VALUES ('4a0177ab-3a20-4a5a-bb9f-d8210e206e06','ff8c7427-e235-4d5a-b218-00767ef8ae1b','Fronet','FRON',4,'2025-12-13 07:33:52','2025-12-13 07:33:52')
    ON CONFLICT(id_geneticcoatmarkingid) DO NOTHING;
    
    INSERT INTO genetic_coat_marking_table(id_geneticcoatmarkingid,id_registry_id_companyid,coat_marking,coat_marking_abbrev,coat_marking_display_order,created,modified) 
    VALUES ('97847e20-f7d8-46ce-a4f0-09d10133310f','ff8c7427-e235-4d5a-b218-00767ef8ae1b','Ilget','ILGT',5,'2025-12-13 07:33:52','2025-12-13 07:33:52')
    ON CONFLICT(id_geneticcoatmarkingid) DO NOTHING;
    
    INSERT INTO genetic_coat_marking_table(id_geneticcoatmarkingid,id_registry_id_companyid,coat_marking,coat_marking_abbrev,coat_marking_display_order,created,modified) 
    VALUES ('f3db691b-bbed-4f35-8582-8b120b705344','ff8c7427-e235-4d5a-b218-00767ef8ae1b','Iset','ISET',6,'2025-12-13 07:33:52','2025-12-13 07:33:52')
    ON CONFLICT(id_geneticcoatmarkingid) DO NOTHING;
    
    INSERT INTO genetic_coat_marking_table(id_geneticcoatmarkingid,id_registry_id_companyid,coat_marking,coat_marking_abbrev,coat_marking_display_order,created,modified) 
    VALUES ('f2fc006c-ce4f-4310-83a6-631cb3646025','ff8c7427-e235-4d5a-b218-00767ef8ae1b','Katmollet','KTMT',7,'2025-12-13 07:33:52','2025-12-13 07:33:52')
    ON CONFLICT(id_geneticcoatmarkingid) DO NOTHING;
    
    INSERT INTO genetic_coat_marking_table(id_geneticcoatmarkingid,id_registry_id_companyid,coat_marking,coat_marking_abbrev,coat_marking_display_order,created,modified) 
    VALUES ('b709fc28-ebc2-41c7-9c0a-cb29a722f477','ff8c7427-e235-4d5a-b218-00767ef8ae1b','Kraiget','KRAI',8,'2025-12-13 07:33:52','2025-12-13 07:33:52')
    ON CONFLICT(id_geneticcoatmarkingid) DO NOTHING;
    
    INSERT INTO genetic_coat_marking_table(id_geneticcoatmarkingid,id_registry_id_companyid,coat_marking,coat_marking_abbrev,coat_marking_display_order,created,modified) 
    VALUES ('ab2cd5b5-54b2-4a81-aa7e-1d1dc5689013','ff8c7427-e235-4d5a-b218-00767ef8ae1b','Kranset','KRAN',9,'2025-12-13 07:33:52','2025-12-13 07:33:52')
    ON CONFLICT(id_geneticcoatmarkingid) DO NOTHING;
    
    INSERT INTO genetic_coat_marking_table(id_geneticcoatmarkingid,id_registry_id_companyid,coat_marking,coat_marking_abbrev,coat_marking_display_order,created,modified) 
    VALUES ('7fdd0ef2-2684-4ce2-bc04-6aac26e1bc71','ff8c7427-e235-4d5a-b218-00767ef8ae1b','Krunet','KRUN',10,'2025-12-13 07:33:52','2025-12-13 07:33:52')
    ON CONFLICT(id_geneticcoatmarkingid) DO NOTHING;
    
    INSERT INTO genetic_coat_marking_table(id_geneticcoatmarkingid,id_registry_id_companyid,coat_marking,coat_marking_abbrev,coat_marking_display_order,created,modified) 
    VALUES ('ca197552-0d38-4066-9aa9-d7f4f819cbe8','ff8c7427-e235-4d5a-b218-00767ef8ae1b','Marlit','MARL',11,'2025-12-13 07:33:52','2025-12-13 07:33:52')
    ON CONFLICT(id_geneticcoatmarkingid) DO NOTHING;
    
    INSERT INTO genetic_coat_marking_table(id_geneticcoatmarkingid,id_registry_id_companyid,coat_marking,coat_marking_abbrev,coat_marking_display_order,created,modified) 
    VALUES ('820e37f5-b02c-4d0c-b126-823b4f58ccf6','ff8c7427-e235-4d5a-b218-00767ef8ae1b','Mirkface','MIRK',12,'2025-12-13 07:33:52','2025-12-13 07:33:52')
    ON CONFLICT(id_geneticcoatmarkingid) DO NOTHING;
    
    INSERT INTO genetic_coat_marking_table(id_geneticcoatmarkingid,id_registry_id_companyid,coat_marking,coat_marking_abbrev,coat_marking_display_order,created,modified) 
    VALUES ('174bde03-3551-4826-8521-7673b37952a5','ff8c7427-e235-4d5a-b218-00767ef8ae1b','Moget Faced','MGTF',13,'2025-12-13 07:33:52','2025-12-13 07:33:52')
    ON CONFLICT(id_geneticcoatmarkingid) DO NOTHING;
    
    INSERT INTO genetic_coat_marking_table(id_geneticcoatmarkingid,id_registry_id_companyid,coat_marking,coat_marking_abbrev,coat_marking_display_order,created,modified) 
    VALUES ('5329088b-3ef1-4cd2-b91f-ed0bd5423c8e','ff8c7427-e235-4d5a-b218-00767ef8ae1b','Mullit','MULL',14,'2025-12-13 07:33:52','2025-12-13 07:33:52')
    ON CONFLICT(id_geneticcoatmarkingid) DO NOTHING;
    
    INSERT INTO genetic_coat_marking_table(id_geneticcoatmarkingid,id_registry_id_companyid,coat_marking,coat_marking_abbrev,coat_marking_display_order,created,modified) 
    VALUES ('0ae25706-348e-4725-85c2-1fddc5e8befb','ff8c7427-e235-4d5a-b218-00767ef8ae1b','Sholmet','SHOL',15,'2025-12-13 07:33:52','2025-12-13 07:33:52')
    ON CONFLICT(id_geneticcoatmarkingid) DO NOTHING;
    
    INSERT INTO genetic_coat_marking_table(id_geneticcoatmarkingid,id_registry_id_companyid,coat_marking,coat_marking_abbrev,coat_marking_display_order,created,modified) 
    VALUES ('e80a885c-697d-4606-9005-7975331a0d47','ff8c7427-e235-4d5a-b218-00767ef8ae1b','Skeget','SLEG',16,'2025-12-13 07:33:52','2025-12-13 07:33:52')
    ON CONFLICT(id_geneticcoatmarkingid) DO NOTHING;
    
    INSERT INTO genetic_coat_marking_table(id_geneticcoatmarkingid,id_registry_id_companyid,coat_marking,coat_marking_abbrev,coat_marking_display_order,created,modified) 
    VALUES ('bb41ecb8-95de-41b7-930e-e20a05b3d25c','ff8c7427-e235-4d5a-b218-00767ef8ae1b','Smirslet','SMIR',17,'2025-12-13 07:33:52','2025-12-13 07:33:52')
    ON CONFLICT(id_geneticcoatmarkingid) DO NOTHING;
    
    INSERT INTO genetic_coat_marking_table(id_geneticcoatmarkingid,id_registry_id_companyid,coat_marking,coat_marking_abbrev,coat_marking_display_order,created,modified) 
    VALUES ('d3801b15-3d80-44c9-874a-4172e0ab8865','ff8c7427-e235-4d5a-b218-00767ef8ae1b','Snaelit','SNAE',18,'2025-12-13 07:33:52','2025-12-13 07:33:52')
    ON CONFLICT(id_geneticcoatmarkingid) DO NOTHING;
    
    INSERT INTO genetic_coat_marking_table(id_geneticcoatmarkingid,id_registry_id_companyid,coat_marking,coat_marking_abbrev,coat_marking_display_order,created,modified) 
    VALUES ('1690f7a2-a1b1-465e-a46b-1502e54c32a2','ff8c7427-e235-4d5a-b218-00767ef8ae1b','Sokket','SOKK',19,'2025-12-13 07:33:52','2025-12-13 07:33:52')
    ON CONFLICT(id_geneticcoatmarkingid) DO NOTHING;
    
    INSERT INTO genetic_coat_marking_table(id_geneticcoatmarkingid,id_registry_id_companyid,coat_marking,coat_marking_abbrev,coat_marking_display_order,created,modified) 
    VALUES ('82bcd09a-3ffc-4f66-b4cd-db191fa0fe8f','ff8c7427-e235-4d5a-b218-00767ef8ae1b','Sponget','SPON',20,'2025-12-13 07:33:52','2025-12-13 07:33:52')
    ON CONFLICT(id_geneticcoatmarkingid) DO NOTHING;
    
    INSERT INTO genetic_coat_marking_table(id_geneticcoatmarkingid,id_registry_id_companyid,coat_marking,coat_marking_abbrev,coat_marking_display_order,created,modified) 
    VALUES ('6b14195f-26aa-4757-8078-796b05fb3aa1','ff8c7427-e235-4d5a-b218-00767ef8ae1b','Yuglet','YGLT',21,'2025-12-13 07:33:52','2025-12-13 07:33:52')
    ON CONFLICT(id_geneticcoatmarkingid) DO NOTHING;
    
    INSERT INTO genetic_coat_marking_table(id_geneticcoatmarkingid,id_registry_id_companyid,coat_marking,coat_marking_abbrev,coat_marking_display_order,created,modified) 
    VALUES ('83ab2e55-526f-414d-9c04-c2a7d7ffeed8','ff8c7427-e235-4d5a-b218-00767ef8ae1b','Blaget','BLGT',22,'2025-12-27 11:49:31','2025-12-27 11:49:31')
    ON CONFLICT(id_geneticcoatmarkingid) DO NOTHING;
    
    INSERT INTO genetic_coat_marking_table(id_geneticcoatmarkingid,id_registry_id_companyid,coat_marking,coat_marking_abbrev,coat_marking_display_order,created,modified) 
    VALUES ('3704a6aa-4e6d-4b24-ba65-e2b0a2146d7f','ff8c7427-e235-4d5a-b218-00767ef8ae1b','Blaeget','BEGT',23,'2025-12-27 11:49:31','2025-12-27 11:49:31')
    ON CONFLICT(id_geneticcoatmarkingid) DO NOTHING;
    
    INSERT INTO genetic_coat_marking_table(id_geneticcoatmarkingid,id_registry_id_companyid,coat_marking,coat_marking_abbrev,coat_marking_display_order,created,modified) 
    VALUES ('d554df78-5d6c-4539-be57-f924d5935293','ff8c7427-e235-4d5a-b218-00767ef8ae1b','Blettet','BLTT',24,'2025-12-27 11:49:31','2025-12-27 11:49:31')
    ON CONFLICT(id_geneticcoatmarkingid) DO NOTHING;
    
    INSERT INTO genetic_coat_marking_table(id_geneticcoatmarkingid,id_registry_id_companyid,coat_marking,coat_marking_abbrev,coat_marking_display_order,created,modified) 
    VALUES ('cf3156c9-8711-46f0-bae2-99c64b9c592f','ff8c7427-e235-4d5a-b218-00767ef8ae1b','Beset','BEST',25,'2025-12-27 11:49:31','2025-12-27 11:49:31')
    ON CONFLICT(id_geneticcoatmarkingid) DO NOTHING;
    
    INSERT INTO genetic_coat_marking_table(id_geneticcoatmarkingid,id_registry_id_companyid,coat_marking,coat_marking_abbrev,coat_marking_display_order,created,modified) 
    VALUES ('28bb94f8-cf59-48df-a81e-010569b91629','ff8c7427-e235-4d5a-b218-00767ef8ae1b','Blesett','BLST',26,'2025-12-27 11:49:31','2025-12-27 11:49:31')
    ON CONFLICT(id_geneticcoatmarkingid) DO NOTHING;
    
    INSERT INTO genetic_coat_marking_table(id_geneticcoatmarkingid,id_registry_id_companyid,coat_marking,coat_marking_abbrev,coat_marking_display_order,created,modified) 
    VALUES ('92db3658-35ab-4064-bbfd-aed8f547d749','ff8c7427-e235-4d5a-b218-00767ef8ae1b','Bielset','BILT',27,'2025-12-27 11:49:31','2025-12-27 11:49:31')
    ON CONFLICT(id_geneticcoatmarkingid) DO NOTHING;
    
    INSERT INTO genetic_coat_marking_table(id_geneticcoatmarkingid,id_registry_id_companyid,coat_marking,coat_marking_abbrev,coat_marking_display_order,created,modified) 
    VALUES ('6a902ba9-bd5a-489f-a46a-5fe8e134d748','ff8c7427-e235-4d5a-b218-00767ef8ae1b','Bronget','BRGT',28,'2025-12-27 11:49:31','2025-12-27 11:49:31')
    ON CONFLICT(id_geneticcoatmarkingid) DO NOTHING;
    
    INSERT INTO genetic_coat_marking_table(id_geneticcoatmarkingid,id_registry_id_companyid,coat_marking,coat_marking_abbrev,coat_marking_display_order,created,modified) 
    VALUES ('78fafa35-94d5-421e-aa97-3153cf9689e3','ff8c7427-e235-4d5a-b218-00767ef8ae1b','Brandet','BRDT',29,'2025-12-27 11:49:31','2025-12-27 11:49:31')
    ON CONFLICT(id_geneticcoatmarkingid) DO NOTHING;
    
    INSERT INTO genetic_coat_marking_table(id_geneticcoatmarkingid,id_registry_id_companyid,coat_marking,coat_marking_abbrev,coat_marking_display_order,created,modified) 
    VALUES ('4787f7ab-4065-41f4-ae18-924a942d4a7f','ff8c7427-e235-4d5a-b218-00767ef8ae1b','Bioget','BOGT',30,'2026-01-01 14:13:51','2026-01-01 14:13:51')
    ON CONFLICT(id_geneticcoatmarkingid) DO NOTHING;
    
    --------------------------------------------------------------------------------------
    -- Add genetic_coat_pattern_table and seed data
    --------------------------------------------------------------------------------------
    
    CREATE TABLE IF NOT EXISTS "genetic_coat_pattern_table" 
      ("id_geneticcoatpatternid" TEXT PRIMARY KEY
      , "id_registry_id_companyid" TEXT NOT NULL 
      , "coat_pattern" TEXT NOT NULL
      , "coat_pattern_abbrev" TEXT NOT NULL
      , "coat_pattern_display_order" INTEGER NOT NULL
      , "created" TEXT NOT NULL CHECK (created IS DATETIME (created))
      , "modified" TEXT NOT NULL CHECK (modified IS DATETIME (modified))
      , FOREIGN KEY (id_registry_id_companyid) REFERENCES company_table (id_companyid)
      , UNIQUE(id_registry_id_companyid, coat_pattern)
      , UNIQUE(id_registry_id_companyid, coat_pattern_abbrev)
      );
    
    -- Do nothing on conflicts here as the table is new and we are only interested in idempotence for the script.
    
    INSERT INTO genetic_coat_pattern_table(id_geneticcoatpatternid,id_registry_id_companyid,coat_pattern,coat_pattern_abbrev,coat_pattern_display_order,created,modified) 
    VALUES ('bc825601-868c-4489-8fcf-45bde1b1f285','ff8c7427-e235-4d5a-b218-00767ef8ae1b','Katmoget','KAT',1,'2025-12-13 07:33:52','2025-12-13 07:33:52')
    ON CONFLICT(id_geneticcoatpatternid) DO NOTHING; 
    
    INSERT INTO genetic_coat_pattern_table(id_geneticcoatpatternid,id_registry_id_companyid,coat_pattern,coat_pattern_abbrev,coat_pattern_display_order,created,modified) 
    VALUES ('4ca0dab5-be28-45fc-959c-cd8a112323f7','ff8c7427-e235-4d5a-b218-00767ef8ae1b','Gulmoget','GUL',2,'2025-12-13 07:33:52','2025-12-13 07:33:52')
    ON CONFLICT(id_geneticcoatpatternid) DO NOTHING; 
    
    INSERT INTO genetic_coat_pattern_table(id_geneticcoatpatternid,id_registry_id_companyid,coat_pattern,coat_pattern_abbrev,coat_pattern_display_order,created,modified) 
    VALUES ('1709fbff-9d2a-4b04-b338-980d38a9d66e','ff8c7427-e235-4d5a-b218-00767ef8ae1b','Gulmoget-Katmoget','GLKT',3,'2025-12-13 07:33:52','2025-12-13 07:33:52')
    ON CONFLICT(id_geneticcoatpatternid) DO NOTHING; 
    
    INSERT INTO genetic_coat_pattern_table(id_geneticcoatpatternid,id_registry_id_companyid,coat_pattern,coat_pattern_abbrev,coat_pattern_display_order,created,modified) 
    VALUES ('d5cf1c6c-1a7f-4cbe-afb5-514e0ca9d9d9','ff8c7427-e235-4d5a-b218-00767ef8ae1b','Light Badger Face','LBF',4,'2025-12-13 07:33:52','2025-12-13 07:33:52')
    ON CONFLICT(id_geneticcoatpatternid) DO NOTHING; 
    
    INSERT INTO genetic_coat_pattern_table(id_geneticcoatpatternid,id_registry_id_companyid,coat_pattern,coat_pattern_abbrev,coat_pattern_display_order,created,modified) 
    VALUES ('2731823c-b19a-41f3-a772-3ef8b064cdd9','ff8c7427-e235-4d5a-b218-00767ef8ae1b','Musket','MKST',5,'2025-12-13 07:33:52','2025-12-13 07:33:52')
    ON CONFLICT(id_geneticcoatpatternid) DO NOTHING; 
    
    INSERT INTO genetic_coat_pattern_table(id_geneticcoatpatternid,id_registry_id_companyid,coat_pattern,coat_pattern_abbrev,coat_pattern_display_order,created,modified) 
    VALUES ('ec590c42-e33e-4c82-8b15-2cfcad2138b9','ff8c7427-e235-4d5a-b218-00767ef8ae1b','Agouti','AG',6,'2025-12-13 07:33:52','2025-12-13 07:33:52')
    ON CONFLICT(id_geneticcoatpatternid) DO NOTHING; 
    
    INSERT INTO genetic_coat_pattern_table(id_geneticcoatpatternid,id_registry_id_companyid,coat_pattern,coat_pattern_abbrev,coat_pattern_display_order,created,modified) 
    VALUES ('d83e9734-e657-4ca1-a7b2-6952cf0612f6','ff8c7427-e235-4d5a-b218-00767ef8ae1b','AWT','AWT',7,'2025-12-13 07:33:52','2025-12-13 07:33:52')
    ON CONFLICT(id_geneticcoatpatternid) DO NOTHING; 
    
    INSERT INTO genetic_coat_pattern_table(id_geneticcoatpatternid,id_registry_id_companyid,coat_pattern,coat_pattern_abbrev,coat_pattern_display_order,created,modified) 
    VALUES ('819cfdb5-aa82-4187-bad6-1671629d6306','ff8c7427-e235-4d5a-b218-00767ef8ae1b','Sweep','SWEEP',8,'2025-12-13 07:33:52','2025-12-13 07:33:52')
    ON CONFLICT(id_geneticcoatpatternid) DO NOTHING; 
    
    --------------------------------------------------------------------------------------
    -- Add metadata_table and seed data
    --------------------------------------------------------------------------------------
    
    CREATE TABLE IF NOT EXISTS "metadata_table"
      ("id_metadataid" TEXT PRIMARY KEY
      , "property_name" TEXT UNIQUE
      , "property_value" TEXT
      , "created" TEXT NOT NULL CHECK (created IS DATETIME (created))
      , "modified" TEXT NOT NULL CHECK (modified IS DATETIME (modified))
      , CHECK ((property_name IS NOT NULL) AND (property_value IS NOT NULL))
      );
    
    -- Do nothing on conflicts here as the table is new and we are only interested in idempotence for the script.
    
    INSERT INTO metadata_table (id_metadataid, property_name, property_value, created, modified)
    VALUES('59e2a273-8755-4e59-81ee-a4c941755df9', 'database_version', '6.1.0', '2026-01-03 09:24:11', '2026-01-03 09:24:11')
    ON CONFLICT(id_metadataid) DO NOTHING;
    
    --------------------------------------------------------------------------------------
    -- Add related_registry_table and seed data
    --------------------------------------------------------------------------------------
    
    CREATE TABLE IF NOT EXISTS "related_registry_table"
      ("primary_registry_id_companyid" TEXT  NOT NULL
      , "related_registry_id_companyid" TEXT  NOT NULL
      , "pedigree_fallback_priority" INTEGER  NOT NULL
      , "created" TEXT NOT NULL CHECK (created IS DATETIME (created))
      , "modified" TEXT NOT NULL CHECK (modified IS DATETIME (modified))
      , FOREIGN KEY (primary_registry_id_companyid) REFERENCES company_table (id_companyid)
      , FOREIGN KEY (related_registry_id_companyid) REFERENCES company_table (id_companyid)
      , PRIMARY KEY (primary_registry_id_companyid, related_registry_id_companyid)
      , CONSTRAINT unique_related_registry_table_primary_registry_id_companyid_and_pedigree_fallback_priority UNIQUE(primary_registry_id_companyid, pedigree_fallback_priority)
      );
    
    -- Do nothing on conflicts here as the table is new and we are only interested in idempotence for the script.
    
    INSERT INTO related_registry_table(primary_registry_id_companyid,related_registry_id_companyid,pedigree_fallback_priority,created,modified) 
    VALUES ('ff8c7427-e235-4d5a-b218-00767ef8ae1b','60a3ea6b-6a48-4e6b-b64c-0d7d8988301b',2,'2025-12-04 05:54:36','2025-12-04 05:54:36')
    ON CONFLICT(primary_registry_id_companyid, related_registry_id_companyid) DO NOTHING;
    
    INSERT INTO related_registry_table(primary_registry_id_companyid,related_registry_id_companyid,pedigree_fallback_priority,created,modified) 
    VALUES ('ff8c7427-e235-4d5a-b218-00767ef8ae1b','cf7bf25d-a3ce-4b7a-8a82-e8fba8ad8ee1',3,'2025-12-04 05:54:36','2025-12-04 05:54:36')
    ON CONFLICT(primary_registry_id_companyid, related_registry_id_companyid) DO NOTHING;
    
    INSERT INTO related_registry_table(primary_registry_id_companyid,related_registry_id_companyid,pedigree_fallback_priority,created,modified) 
    VALUES ('3a7e2399-17fd-4a8f-af43-d66fde9e0539','dc9ffa44-049c-4b34-8430-61a442bbe025',2,'2025-12-04 05:54:36','2025-12-04 05:54:36')
    ON CONFLICT(primary_registry_id_companyid, related_registry_id_companyid) DO NOTHING;
    
    INSERT INTO related_registry_table(primary_registry_id_companyid,related_registry_id_companyid,pedigree_fallback_priority,created,modified) 
    VALUES ('3a7e2399-17fd-4a8f-af43-d66fde9e0539','d2122a99-b1c1-419f-8e18-28e1112dc7a8',3,'2025-12-04 05:54:36','2025-12-04 05:54:36')
    ON CONFLICT(primary_registry_id_companyid, related_registry_id_companyid) DO NOTHING;
    
    --------------------------------------------------------------------------------------
    -- Update standard default settings owner_id_premiseid to the unknown premise
    --------------------------------------------------------------------------------------
    
    UPDATE animaltrakker_default_settings_table
    SET owner_id_premiseid = '4a04fcfe-889f-4cd9-8abe-bdd59807ad07'
    WHERE id_animaltrakkerdefaultsettingsid = '29753af4-2b46-49b3-854c-4644d8919db6';
    
    --------------------------------------------------------------------------------------
    -- Update database version in animaltrakker_metadata_table
    --------------------------------------------------------------------------------------
    
    UPDATE animaltrakker_metadata_table
    SET database_version = '6.1.0', modified = '2026-01-03 09:24:11'
    WHERE id_animaltrakkermetadataid = 'dd7ce5d0-4aa5-44cd-bfe4-97e35259430f';
    
    --------------------------------------------------------------------------------------
    -- Add additional company_email_table seed data
    --------------------------------------------------------------------------------------
    
    -- Do nothing on conflicts as the rows are new and we are only interested in idempotence for the script.
    
    INSERT INTO company_email_table (id_companyemailid, id_companyid, id_emailtypeid, company_email, created, modified) 
    VALUES ('cc685e80-4394-47b8-aece-d03a4153ea9a', 'cf7bf25d-a3ce-4b7a-8a82-e8fba8ad8ee1', '351dfa5c-be92-4d8f-97e2-ec0fbebfdd4b', 'secretary@shetland-sheep.org.uk', '2025-12-13 12:02:34', '2025-12-13 12:02:34')
    ON CONFLICT(id_companyemailid) DO NOTHING;
    
    INSERT INTO company_email_table (id_companyemailid, id_companyid, id_emailtypeid, company_email, created, modified) 
    VALUES ('7b221fd3-e60a-41f6-852a-648f1a8ba044', 'ff8c7427-e235-4d5a-b218-00767ef8ae1b', '351dfa5c-be92-4d8f-97e2-ec0fbebfdd4b', 'secretary2@shetland-sheep.org', '2025-12-13 12:02:34', '2025-12-13 12:02:34')
    ON CONFLICT(id_companyemailid) DO NOTHING;
    
    INSERT INTO company_email_table (id_companyemailid, id_companyid, id_emailtypeid, company_email, created, modified) 
    VALUES ('8c7e5d45-88c4-43b8-a52b-fc6a7c35097d', '3a7e2399-17fd-4a8f-af43-d66fde9e0539', '351dfa5c-be92-4d8f-97e2-ec0fbebfdd4b', 'secretary@blackwelsh.org', '2025-12-13 12:02:34', '2025-12-13 12:02:34')
    ON CONFLICT(id_companyemailid) DO NOTHING;
    
    --------------------------------------------------------------------------------------
    -- Add additional company_phone_table seed data
    --------------------------------------------------------------------------------------
    
    -- Do nothing on conflicts as the rows are new and we are only interested in idempotence for the script.
    
    INSERT INTO company_phone_table(id_companyphoneid,id_companyid,id_phonetypeid,company_phone,created,modified) 
    VALUES ('4ecb78f6-4d3b-46c3-9407-1e350474b7ef','60a3ea6b-6a48-4e6b-b64c-0d7d8988301b','691ecec8-75dc-426a-af38-8666efe22409','785-456-8500','2025-12-04 05:54:36','2025-12-04 05:54:36')
    ON CONFLICT(id_companyphoneid) DO NOTHING;
    
    --------------------------------------------------------------------------------------
    -- Add additional company_premise_table seed data
    --------------------------------------------------------------------------------------
    
    -- Do nothing on conflicts as the rows are new and we are only interested in idempotence for the script.
    
    INSERT INTO company_premise_table(id_companypremiseid,id_companyid,id_premiseid,start_premise_use,end_premise_use,created,modified) 
    VALUES ('978c73ad-f2a9-4233-85f3-3d0fab8cf76f','60a3ea6b-6a48-4e6b-b64c-0d7d8988301b','465399f7-4a62-4b6c-87d9-aea9adcb6c74','1973-01-01','2024-12-09','2023-02-25 14:29:36','2025-12-04 05:54:36')
    ON CONFLICT(id_companypremiseid) DO NOTHING;
    
    INSERT INTO company_premise_table(id_companypremiseid,id_companyid,id_premiseid,start_premise_use,end_premise_use,created,modified) 
    VALUES ('f4e1dc11-426d-41ee-ba85-9817c555b75e','60a3ea6b-6a48-4e6b-b64c-0d7d8988301b','9bcfcd72-449a-4bc7-a152-cb69d67ffe18','1973-01-01','2024-12-09','2023-02-28 11:43:51','2025-12-04 05:54:36')
    ON CONFLICT(id_companypremiseid) DO NOTHING;
    
    INSERT INTO company_premise_table(id_companypremiseid,id_companyid,id_premiseid,start_premise_use,end_premise_use,created,modified) 
    VALUES ('e04d9d11-de05-43e4-bd92-9ca7d08ef818','60a3ea6b-6a48-4e6b-b64c-0d7d8988301b','c74085ef-ad6b-4321-aeeb-748c36b405b3','2024-12-10',NULL,'2025-12-04 05:54:36','2025-12-04 05:54:36')
    ON CONFLICT(id_companypremiseid) DO NOTHING;
    
    INSERT INTO company_premise_table(id_companypremiseid,id_companyid,id_premiseid,start_premise_use,end_premise_use,created,modified) 
    VALUES ('b677a5fa-74eb-42b3-9a3b-15dd2264d627','ff8c7427-e235-4d5a-b218-00767ef8ae1b','dd2c188a-d5d6-41ac-bc65-58a9444d87ed','2014-05-19',NULL,'2025-12-04 05:54:36','2025-12-04 05:54:36')
    ON CONFLICT(id_companypremiseid) DO NOTHING;
    
    INSERT INTO company_premise_table(id_companypremiseid,id_companyid,id_premiseid,start_premise_use,end_premise_use,created,modified) 
    VALUES ('35ab55ac-bcb3-4ece-b168-f782a2ea0b22','cf7bf25d-a3ce-4b7a-8a82-e8fba8ad8ee1','92961f8e-da67-449a-afff-2998187a1909','2022-11-14',NULL,'2025-12-04 05:54:36','2025-12-04 05:54:36')
    ON CONFLICT(id_companypremiseid) DO NOTHING;
    
    INSERT INTO company_premise_table(id_companypremiseid,id_companyid,id_premiseid,start_premise_use,end_premise_use,created,modified) 
    VALUES ('e6e27cc4-b447-4268-b295-a889779ddf55','cde7ec79-566b-441f-a6aa-b9281c25f609','47790be9-3180-483f-beeb-15f0434bd85b','2019-01-01',NULL,'2023-02-25 14:29:36','2023-02-25 14:29:36')
    ON CONFLICT(id_companypremiseid) DO NOTHING;
    
    INSERT INTO company_premise_table(id_companypremiseid,id_companyid,id_premiseid,start_premise_use,end_premise_use,created,modified) 
    VALUES ('43244927-5803-4318-9a14-03ae6f1a870f','5d89623c-0711-4881-b9cf-296bab9f95cb','fe05edd7-03e5-419d-b6e6-28a9d3f51237','1973-01-01','1997-12-31','2023-02-25 14:29:36','2023-02-25 14:29:36')
    ON CONFLICT(id_companypremiseid) DO NOTHING;
    
    INSERT INTO company_premise_table(id_companypremiseid,id_companyid,id_premiseid,start_premise_use,end_premise_use,created,modified) 
    VALUES ('d40af4c4-ea44-406f-9ad8-cc9334f7ef93','39a84eff-0d1f-4a92-86a3-d2f107ac2c9a','c4f4a973-042e-42c2-90db-3fdad2d7b5f5','2000-01-01',NULL,'2024-10-24 12:57:56','2024-10-24 12:57:56')
    ON CONFLICT(id_companypremiseid) DO NOTHING;  
    
    --------------------------------------------------------------------------------------
    -- Add additional company_table seed data
    --------------------------------------------------------------------------------------
    
    -- Do nothing on conflicts as the rows are new and we are only interested in idempotence for the script.
    
    INSERT INTO company_table(id_companyid,company,created,modified)
    VALUES ('60a3ea6b-6a48-4e6b-b64c-0d7d8988301b','North American Shetland Sheepbreeders Association','2023-02-24 21:42:29','2023-02-24 21:42:29')
    ON CONFLICT(id_companyid) DO NOTHING;
    
    INSERT INTO company_table(id_companyid,company,created,modified) 
    VALUES ('ff8c7427-e235-4d5a-b218-00767ef8ae1b','Fine Fleece Shetland Sheep Association Inc','2025-12-04 05:54:36','2025-12-04 05:54:36')
    ON CONFLICT(id_companyid) DO NOTHING;
    
    INSERT INTO company_table(id_companyid,company,created,modified) 
    VALUES ('cf7bf25d-a3ce-4b7a-8a82-e8fba8ad8ee1','Shetland Sheep Society','2025-12-04 05:54:36','2025-12-04 05:54:36')
    ON CONFLICT(id_companyid) DO NOTHING;
    
    INSERT INTO company_table(id_companyid,company,created,modified) 
    VALUES ('cde7ec79-566b-441f-a6aa-b9281c25f609','Black Welsh Mountain Sheep Breeders'' Association','2023-02-24 21:42:29','2023-02-24 21:42:29')
    ON CONFLICT(id_companyid) DO NOTHING;
    
    INSERT INTO company_table(id_companyid,company,created,modified) 
    VALUES ('5d89623c-0711-4881-b9cf-296bab9f95cb','North American Black Welsh Mountain Sheep Registry','2023-02-24 21:42:29','2023-02-24 21:42:29')
    ON CONFLICT(id_companyid) DO NOTHING;
    
    INSERT INTO company_table(id_companyid,company,created,modified) 
    VALUES ('f43651ce-98e4-41f3-8d85-4d81d82857ac','Oxford Nanopore','2024-11-08 06:44:41','2024-11-08 06:44:41')
    ON CONFLICT(id_companyid) DO NOTHING;
    
    INSERT INTO company_table(id_companyid,company,created,modified) 
    VALUES ('39a84eff-0d1f-4a92-86a3-d2f107ac2c9a','Neogen','2024-10-24 12:57:56','2024-10-24 12:57:56')
    ON CONFLICT(id_companyid) DO NOTHING;
    
    --------------------------------------------------------------------------------------
    -- Add additional company_website_table seed data
    --------------------------------------------------------------------------------------
    
    -- Do nothing on conflicts as the rows are new and we are only interested in idempotence for the script.
    
    INSERT INTO company_website_table(id_companywebsiteid,id_companyid,company_website,created,modified) 
    VALUES ('79c2fb8c-229a-4e25-89ee-7d4c19ae11d5','3a7e2399-17fd-4a8f-af43-d66fde9e0539','www.blackwelsh.org','2023-04-14 14:52:45','2025-12-04 05:54:36')
    ON CONFLICT(id_companywebsiteid) DO NOTHING;
    
    INSERT INTO company_website_table(id_companywebsiteid,id_companyid,company_website,created,modified) 
    VALUES ('787796e3-e7e8-4d4b-87b4-7c6477245b7e','60a3ea6b-6a48-4e6b-b64c-0d7d8988301b','www.shetland-sheep.org','2025-12-04 05:54:36','2025-12-04 05:54:36')
    ON CONFLICT(id_companywebsiteid) DO NOTHING;
    
    INSERT INTO company_website_table(id_companywebsiteid,id_companyid,company_website,created,modified) 
    VALUES ('2f033cbb-7bf0-472f-bdf0-a73af8661063','ff8c7427-e235-4d5a-b218-00767ef8ae1b','www.finefleeceshetlandsheep.org','2025-12-04 05:54:36','2025-12-04 05:54:36')
    ON CONFLICT(id_companywebsiteid) DO NOTHING;
    
    INSERT INTO company_website_table(id_companywebsiteid,id_companyid,company_website,created,modified) 
    VALUES ('da9f7389-fed6-4fd8-8094-7e30e1abac93','cf7bf25d-a3ce-4b7a-8a82-e8fba8ad8ee1','www.shetland-sheep.org.uk','2025-12-04 05:54:36','2025-12-04 05:54:36')
    ON CONFLICT(id_companywebsiteid) DO NOTHING;
    
    --------------------------------------------------------------------------------------
    -- Add additional genetic_characteristic_table seed data
    --------------------------------------------------------------------------------------
    
    -- Do nothing on conflicts as the rows are new and we are only interested in idempotence for the script.
    
    INSERT INTO genetic_characteristic_table (id_geneticcharacteristicid, genetic_characteristic_table_name, genetic_characteristic_table_display_name, genetic_characteristic_table_display_order, created, modified) 
    VALUES ('eaf48d65-bde0-42d9-ba2c-b431af12390a', 'genetic_coat_marking_table', 'Coat Marking', '26', '2025-12-13 07:33:52', '2025-12-13 07:33:52')
    ON CONFLICT(id_geneticcharacteristicid) DO NOTHING;
    
    INSERT INTO genetic_characteristic_table (id_geneticcharacteristicid, genetic_characteristic_table_name, genetic_characteristic_table_display_name, genetic_characteristic_table_display_order, created, modified) 
    VALUES ('59badffb-dc5b-4a9c-b655-5431d0258436', 'genetic_coat_pattern_table', 'Coat Pattern', '27', '2025-12-13 07:33:52', '2025-12-13 07:33:52')
    ON CONFLICT(id_geneticcharacteristicid) DO NOTHING;  
    
    --------------------------------------------------------------------------------------
    -- Add additional genetic_coat_color_table seed data
    --------------------------------------------------------------------------------------
    
    -- Do nothing on conflicts as the rows are new and we are only interested in idempotence for the script.
    
    INSERT INTO genetic_coat_color_table(id_geneticcoatcolorid,id_registry_id_companyid,coat_color,coat_color_abbrev,coat_color_display_order,created,modified) 
    VALUES ('7e538555-1e38-476c-a73d-37b18f7b26c1','ff8c7427-e235-4d5a-b218-00767ef8ae1b','Black','BLK',1,'2025-12-13 07:33:52','2025-12-13 07:33:52')
    ON CONFLICT(id_geneticcoatcolorid) DO NOTHING;
    
    INSERT INTO genetic_coat_color_table(id_geneticcoatcolorid,id_registry_id_companyid,coat_color,coat_color_abbrev,coat_color_display_order,created,modified) 
    VALUES ('c220ed78-117b-42e5-9633-e9bb384a7b05','ff8c7427-e235-4d5a-b218-00767ef8ae1b','Dark Brown','DKBN',2,'2025-12-13 07:33:52','2025-12-13 07:33:52')
    ON CONFLICT(id_geneticcoatcolorid) DO NOTHING;
    
    INSERT INTO genetic_coat_color_table(id_geneticcoatcolorid,id_registry_id_companyid,coat_color,coat_color_abbrev,coat_color_display_order,created,modified) 
    VALUES ('fb0645a7-f8ad-4ad9-8706-45c0fc0398b0','ff8c7427-e235-4d5a-b218-00767ef8ae1b','Emsket','EMSK',3,'2025-12-13 07:33:52','2025-12-13 07:33:52')
    ON CONFLICT(id_geneticcoatcolorid) DO NOTHING;
    
    INSERT INTO genetic_coat_color_table(id_geneticcoatcolorid,id_registry_id_companyid,coat_color,coat_color_abbrev,coat_color_display_order,created,modified) 
    VALUES ('33ed6a2b-7d22-47fd-9948-8552b173b388','ff8c7427-e235-4d5a-b218-00767ef8ae1b','Fawn','FAWN',4,'2025-12-13 07:33:52','2025-12-13 07:33:52')
    ON CONFLICT(id_geneticcoatcolorid) DO NOTHING;
    
    INSERT INTO genetic_coat_color_table(id_geneticcoatcolorid,id_registry_id_companyid,coat_color,coat_color_abbrev,coat_color_display_order,created,modified) 
    VALUES ('5e41338c-bd54-4c6a-8a53-014c9879714d','ff8c7427-e235-4d5a-b218-00767ef8ae1b','Grey','GREY',5,'2025-12-13 07:33:52','2025-12-13 07:33:52')
    ON CONFLICT(id_geneticcoatcolorid) DO NOTHING;
    
    INSERT INTO genetic_coat_color_table(id_geneticcoatcolorid,id_registry_id_companyid,coat_color,coat_color_abbrev,coat_color_display_order,created,modified) 
    VALUES ('f60bcec0-7e5f-4c12-adfa-b125851e40cd','ff8c7427-e235-4d5a-b218-00767ef8ae1b','Light Grey','LTGR',6,'2025-12-13 07:33:52','2025-12-13 07:33:52')
    ON CONFLICT(id_geneticcoatcolorid) DO NOTHING;
    
    INSERT INTO genetic_coat_color_table(id_geneticcoatcolorid,id_registry_id_companyid,coat_color,coat_color_abbrev,coat_color_display_order,created,modified) 
    VALUES ('383c5125-cb6b-4244-a74c-a1c6ff1e78e8','ff8c7427-e235-4d5a-b218-00767ef8ae1b','Dark Grey','DKGR',7,'2025-12-13 07:33:52','2025-12-13 07:33:52')
    ON CONFLICT(id_geneticcoatcolorid) DO NOTHING;
    
    INSERT INTO genetic_coat_color_table(id_geneticcoatcolorid,id_registry_id_companyid,coat_color,coat_color_abbrev,coat_color_display_order,created,modified) 
    VALUES ('7aa13247-0e59-417d-bf21-926fb5a1a1f1','ff8c7427-e235-4d5a-b218-00767ef8ae1b','Shaela','SHLA',8,'2025-12-13 07:33:52','2025-12-13 07:33:52')
    ON CONFLICT(id_geneticcoatcolorid) DO NOTHING;
    
    INSERT INTO genetic_coat_color_table(id_geneticcoatcolorid,id_registry_id_companyid,coat_color,coat_color_abbrev,coat_color_display_order,created,modified) 
    VALUES ('0273c1ac-1c36-4e9c-866d-8f9faf757057','ff8c7427-e235-4d5a-b218-00767ef8ae1b','White','WHT',9,'2025-12-13 07:33:52','2025-12-13 07:33:52')
    ON CONFLICT(id_geneticcoatcolorid) DO NOTHING;
    
    INSERT INTO genetic_coat_color_table(id_geneticcoatcolorid,id_registry_id_companyid,coat_color,coat_color_abbrev,coat_color_display_order,created,modified) 
    VALUES ('3c073af3-5377-419c-a895-add435f60552','ff8c7427-e235-4d5a-b218-00767ef8ae1b','Mioget','MGT',10,'2025-12-13 07:33:52','2025-12-13 07:33:52')
    ON CONFLICT(id_geneticcoatcolorid) DO NOTHING;
    
    INSERT INTO genetic_coat_color_table(id_geneticcoatcolorid,id_registry_id_companyid,coat_color,coat_color_abbrev,coat_color_display_order,created,modified) 
    VALUES ('a1981ebd-d96b-416e-be54-54e72bc1fe36','ff8c7427-e235-4d5a-b218-00767ef8ae1b','Moorit','MRRT',11,'2025-12-13 07:33:52','2025-12-13 07:33:52')
    ON CONFLICT(id_geneticcoatcolorid) DO NOTHING;
    
    INSERT INTO genetic_coat_color_table(id_geneticcoatcolorid,id_registry_id_companyid,coat_color,coat_color_abbrev,coat_color_display_order,created,modified) 
    VALUES ('84b1ad11-f50c-4bd1-ad27-eb20be57daca','ff8c7427-e235-4d5a-b218-00767ef8ae1b','Musket/AG Brown','AGBN',12,'2025-12-13 07:33:52','2025-12-13 07:33:52')
    ON CONFLICT(id_geneticcoatcolorid) DO NOTHING;
    
    INSERT INTO genetic_coat_color_table(id_geneticcoatcolorid,id_registry_id_companyid,coat_color,coat_color_abbrev,coat_color_display_order,created,modified) 
    VALUES ('d15abbcf-3c39-4b4c-bd39-4cec34189cbd','ff8c7427-e235-4d5a-b218-00767ef8ae1b','Grey/Fading GreyAG Black','AGBK',13,'2025-12-13 07:33:52','2025-12-13 07:33:52')
    ON CONFLICT(id_geneticcoatcolorid) DO NOTHING;
    
    INSERT INTO genetic_coat_color_table(id_geneticcoatcolorid,id_registry_id_companyid,coat_color,coat_color_abbrev,coat_color_display_order,created,modified) 
    VALUES ('9f9be293-2439-4b62-a77e-39caf7c34a42','ff8c7427-e235-4d5a-b218-00767ef8ae1b','Unknown','UNK',14,'2025-12-26 11:20:57','2025-12-26 11:20:57')
    ON CONFLICT(id_geneticcoatcolorid) DO NOTHING;  
    
    --------------------------------------------------------------------------------------
    -- Add additional genetic_horn_type_table seed data
    --------------------------------------------------------------------------------------
    
    -- Do nothing on conflicts as the rows are new and we are only interested in idempotence for the script.
    
    INSERT INTO genetic_horn_type_table (id_genetichorntypeid, id_registry_id_companyid, horn_type, horn_type_abbrev, horn_type_display_order, created, modified) 
    VALUES ('69938116-07e5-495e-90fa-40f1fdd9df5c', 'ed382247-5cef-48ea-b7fe-b09491dc9ad6', 'Unknown', 'U', '4', '2025-12-23 06:56:08', '2025-12-23 06:56:08')
    ON CONFLICT(id_genetichorntypeid) DO NOTHING;
    
    --------------------------------------------------------------------------------------
    -- Add additional id_type_table seed data
    --------------------------------------------------------------------------------------
    
    -- Do nothing on conflicts as the rows are new and we are only interested in idempotence for the script.
    
    INSERT INTO id_type_table(id_idtypeid,id_type_name,id_type_abbrev,id_type_display_order,created,modified) 
    VALUES ('2e8a9552-1ad3-43f8-a417-eefb3a79946a','NSIP_ID','NSIP',17,'2025-12-13 07:47:32','2025-12-13 07:47:32')
    ON CONFLICT(id_idtypeid) DO NOTHING;
    
    INSERT INTO id_type_table(id_idtypeid,id_type_name,id_type_abbrev,id_type_display_order,created,modified) 
    VALUES ('5434810e-4b52-4e88-9a02-c34b5b488205','Flock_54_BDI','Flock 54',18,'2025-12-13 07:47:32','2025-12-13 07:47:32')
    ON CONFLICT(id_idtypeid) DO NOTHING;  
    
    --------------------------------------------------------------------------------------
    -- Add additional premise_table seed data
    --------------------------------------------------------------------------------------
    
    -- Do nothing on conflicts as the rows are new and we are only interested in idempotence for the script.
    
    INSERT INTO premise_table(id_premiseid,id_premisetypeid,id_premisejurisdictionid,premise_number,premise_lat_long_id_unitsid,premise_latitude,premise_longitude,premise_address1,premise_address2,premise_city,premise_id_stateid,premise_postcode,premise_id_countyid,premise_id_countryid,created,modified) 
    VALUES ('465399f7-4a62-4b6c-87d9-aea9adcb6c74','7f58eb72-40bc-4dde-a929-611944eb291d',NULL,NULL,NULL,NULL,NULL,'305 Lincoln',NULL,'Wamego','1ca9bbee-8ef3-47b1-9517-8764bc37f664',66547,NULL,'b41f2392-2517-459d-b074-464d6915fafa','2023-02-28 10:48:22','2023-02-28 10:48:22')
    ON CONFLICT(id_premiseid) DO NOTHING;
    
    INSERT INTO premise_table(id_premiseid,id_premisetypeid,id_premisejurisdictionid,premise_number,premise_lat_long_id_unitsid,premise_latitude,premise_longitude,premise_address1,premise_address2,premise_city,premise_id_stateid,premise_postcode,premise_id_countyid,premise_id_countryid,created,modified) 
    VALUES ('9bcfcd72-449a-4bc7-a152-cb69d67ffe18','25ddcb3e-10a5-4afc-b4a0-4d1fafe8a7f2',NULL,NULL,NULL,NULL,NULL,'PO Box 231',NULL,'Wamego','1ca9bbee-8ef3-47b1-9517-8764bc37f664',66547,NULL,'b41f2392-2517-459d-b074-464d6915fafa','2023-02-24 22:00:04','2023-02-24 22:00:04')
    ON CONFLICT(id_premiseid) DO NOTHING;
    
    INSERT INTO premise_table(id_premiseid,id_premisetypeid,id_premisejurisdictionid,premise_number,premise_lat_long_id_unitsid,premise_latitude,premise_longitude,premise_address1,premise_address2,premise_city,premise_id_stateid,premise_postcode,premise_id_countyid,premise_id_countryid,created,modified) 
    VALUES ('c74085ef-ad6b-4321-aeeb-748c36b405b3','25ddcb3e-10a5-4afc-b4a0-4d1fafe8a7f2',NULL,NULL,NULL,NULL,NULL,'PO Box 27',NULL,'Sedalia','9c651e1e-77be-4319-9040-110236b899c9',65302,NULL,'b41f2392-2517-459d-b074-464d6915fafa','2025-12-04 05:54:36','2025-12-04 05:54:36')
    ON CONFLICT(id_premiseid) DO NOTHING;
    
    INSERT INTO premise_table(id_premiseid,id_premisetypeid,id_premisejurisdictionid,premise_number,premise_lat_long_id_unitsid,premise_latitude,premise_longitude,premise_address1,premise_address2,premise_city,premise_id_stateid,premise_postcode,premise_id_countyid,premise_id_countryid,created,modified) 
    VALUES ('dd2c188a-d5d6-41ac-bc65-58a9444d87ed','28e2b327-5ced-4f39-bc60-90450bc719c6',NULL,NULL,NULL,NULL,NULL,'W 7505 Highway 11',NULL,'Monroe','881f5cff-949b-41e2-82b4-c0bd9b3a3212',53566,NULL,'b41f2392-2517-459d-b074-464d6915fafa','2025-12-04 05:54:36','2025-12-04 05:54:36')
    ON CONFLICT(id_premiseid) DO NOTHING;
    
    INSERT INTO premise_table(id_premiseid,id_premisetypeid,id_premisejurisdictionid,premise_number,premise_lat_long_id_unitsid,premise_latitude,premise_longitude,premise_address1,premise_address2,premise_city,premise_id_stateid,premise_postcode,premise_id_countyid,premise_id_countryid,created,modified) 
    VALUES ('92961f8e-da67-449a-afff-2998187a1909','28e2b327-5ced-4f39-bc60-90450bc719c6',NULL,NULL,NULL,NULL,NULL,'9 Bowling Green Road',NULL,'Kirkliston','6e5b33af-9884-4afa-9981-ea504b27ea0a','EH29 9BG',NULL,'3cbe355a-b195-4ec2-aad6-e5ec3b5a12a7','2025-12-04 05:54:36','2025-12-04 05:54:36')
    ON CONFLICT(id_premiseid) DO NOTHING;
    
    INSERT INTO premise_table(id_premiseid,id_premisetypeid,id_premisejurisdictionid,premise_number,premise_lat_long_id_unitsid,premise_latitude,premise_longitude,premise_address1,premise_address2,premise_city,premise_id_stateid,premise_postcode,premise_id_countyid,premise_id_countryid,created,modified) 
    VALUES ('47790be9-3180-483f-beeb-15f0434bd85b','28e2b327-5ced-4f39-bc60-90450bc719c6',NULL,NULL,NULL,NULL,NULL,'Ty''n y Mynydd Farm','Boduan','Pwllheli','fdc434bf-a1d1-48fb-b650-854e06898f6c','LL53 8PZ',NULL,'3cbe355a-b195-4ec2-aad6-e5ec3b5a12a7','2023-02-24 22:00:04','2023-11-26 11:36:18')
    ON CONFLICT(id_premiseid) DO NOTHING;
    
    INSERT INTO premise_table(id_premiseid,id_premisetypeid,id_premisejurisdictionid,premise_number,premise_lat_long_id_unitsid,premise_latitude,premise_longitude,premise_address1,premise_address2,premise_city,premise_id_stateid,premise_postcode,premise_id_countyid,premise_id_countryid,created,modified) 
    VALUES ('fe05edd7-03e5-419d-b6e6-28a9d3f51237','28e2b327-5ced-4f39-bc60-90450bc719c6',NULL,NULL,NULL,NULL,NULL,'13469 S. Trueblood Place',NULL,'Terre Haute','8568f999-b016-4920-a003-559ae0bdce2b','47802',NULL,'b41f2392-2517-459d-b074-464d6915fafa','2023-02-24 22:00:04','2023-02-24 22:00:04')
    ON CONFLICT(id_premiseid) DO NOTHING;
    
    INSERT INTO premise_table(id_premiseid,id_premisetypeid,id_premisejurisdictionid,premise_number,premise_lat_long_id_unitsid,premise_latitude,premise_longitude,premise_address1,premise_address2,premise_city,premise_id_stateid,premise_postcode,premise_id_countyid,premise_id_countryid,created,modified) 
    VALUES ('c4f4a973-042e-42c2-90db-3fdad2d7b5f5','28e2b327-5ced-4f39-bc60-90450bc719c6',NULL,NULL,NULL,NULL,NULL,'620 Lesher Place',NULL,'Lansing','4035f757-84cf-4d4e-8ad6-f77741808780','48912',NULL,'b41f2392-2517-459d-b074-464d6915fafa','2024-10-24 12:57:56','2025-05-19 11:10:22')
    ON CONFLICT(id_premiseid) DO NOTHING;
    
    --------------------------------------------------------------------------------------
    -- Add additional registry_info_table seed data
    --------------------------------------------------------------------------------------
    
    -- Do nothing on conflicts as the rows are new and we are only interested in idempotence for the script.
    
    INSERT INTO registry_info_table(id_registryinfoid,id_companyid,registry_founded_date,registry_closed_date,registry_abbrev,id_breedid,created,modified) 
    VALUES ('fd5e1bb2-b7a7-478f-b586-9470a5ac502e','3a7e2399-17fd-4a8f-af43-d66fde9e0539','1998-01-01',NULL,'ABWMSA','e8d5cda1-92ac-4173-b97b-880beb987371','2023-05-23 13:54:42','2023-05-23 13:54:42')
    ON CONFLICT(id_registryinfoid) DO NOTHING;
    
    INSERT INTO registry_info_table(id_registryinfoid,id_companyid,registry_founded_date,registry_closed_date,registry_abbrev,id_breedid,created,modified) 
    VALUES ('dcdbfeec-b46d-41f2-8d00-8d8de007e49a','cde7ec79-566b-441f-a6aa-b9281c25f609','1920-01-01',NULL,'BWMSBA','e8d5cda1-92ac-4173-b97b-880beb987371','2023-05-23 13:54:42','2023-05-23 13:54:42')
    ON CONFLICT(id_registryinfoid) DO NOTHING;
    
    INSERT INTO registry_info_table(id_registryinfoid,id_companyid,registry_founded_date,registry_closed_date,registry_abbrev,id_breedid,created,modified) 
    VALUES ('29c136ac-eaea-434f-bb8a-cec3361b3039','5d89623c-0711-4881-b9cf-296bab9f95cb','1990-01-01','2000-12-31','NABWMSR','e8d5cda1-92ac-4173-b97b-880beb987371','2023-05-23 13:54:42','2023-05-23 13:54:42')
    ON CONFLICT(id_registryinfoid) DO NOTHING;
    
    INSERT INTO registry_info_table(id_registryinfoid,id_companyid,registry_founded_date,registry_closed_date,registry_abbrev,id_breedid,created,modified) 
    VALUES ('0974920a-bd19-4588-b70b-3a86a1a3c111','dc9ffa44-049c-4b34-8430-61a442bbe025','2012-09-01',NULL,'ACWMSA','a9d3f92e-4a82-4355-91a4-ce4599865e65','2023-05-23 13:54:42','2023-05-23 13:54:42')
    ON CONFLICT(id_registryinfoid) DO NOTHING;
    
    INSERT INTO registry_info_table(id_registryinfoid,id_companyid,registry_founded_date,registry_closed_date,registry_abbrev,id_breedid,created,modified) 
    VALUES ('256529d7-73dd-4903-8c04-7dd88b0f0b4c','d2122a99-b1c1-419f-8e18-28e1112dc7a8','2012-09-01',NULL,'AWWMSA','004e8c9c-584a-405c-91d4-64f1e968a67a','2023-05-23 13:54:42','2023-05-23 13:54:42')
    ON CONFLICT(id_registryinfoid) DO NOTHING;
    
    INSERT INTO registry_info_table(id_registryinfoid,id_companyid,registry_founded_date,registry_closed_date,registry_abbrev,id_breedid,created,modified) 
    VALUES ('a63c47f2-cb8e-431d-b97e-944bd5659d03','60a3ea6b-6a48-4e6b-b64c-0d7d8988301b','1991-01-01',NULL,'NASSA','ca26a140-a91f-42fc-ab09-9d12f6846f84','2023-05-23 13:54:42','2023-05-23 13:54:42')
    ON CONFLICT(id_registryinfoid) DO NOTHING;
    
    INSERT INTO registry_info_table(id_registryinfoid,id_companyid,registry_founded_date,registry_closed_date,registry_abbrev,id_breedid,created,modified) 
    VALUES ('545c6eac-4f3f-482d-b035-583133ffce2e','ff8c7427-e235-4d5a-b218-00767ef8ae1b','2014-05-19',NULL,'FFSSA','ca26a140-a91f-42fc-ab09-9d12f6846f84','2025-12-13 12:02:34','2025-12-13 12:02:34')
    ON CONFLICT(id_registryinfoid) DO NOTHING;
    
    INSERT INTO registry_info_table(id_registryinfoid,id_companyid,registry_founded_date,registry_closed_date,registry_abbrev,id_breedid,created,modified) 
    VALUES ('643259b0-00e7-4bca-89a5-988f9b1cabd7','cf7bf25d-a3ce-4b7a-8a82-e8fba8ad8ee1','2022-11-14',NULL,'SSS','ca26a140-a91f-42fc-ab09-9d12f6846f84','2025-12-13 12:02:34','2025-12-13 12:02:34')
    ON CONFLICT(id_registryinfoid) DO NOTHING;
    
    --------------------------------------------------------------------------------------
    -- Add additional registry_membership_region_table seed data
    --------------------------------------------------------------------------------------
    
    -- Do nothing on conflicts as the rows are new and we are only interested in idempotence for the script.
    
    INSERT INTO registry_membership_region_table(id_registrymembershipregionid,registry_id_companyid,membership_region,membership_region_number,membership_region_display_order,created,modified)
    VALUES ('6beefa50-06a5-4680-8ca2-f1bf35976d1a','3a7e2399-17fd-4a8f-af43-d66fde9e0539','Eastern',1,1,'2023-05-31 18:22:17','2023-05-31 18:22:17')
    ON CONFLICT(id_registrymembershipregionid) DO NOTHING;
    
    INSERT INTO registry_membership_region_table(id_registrymembershipregionid,registry_id_companyid,membership_region,membership_region_number,membership_region_display_order,created,modified)
    VALUES ('b963f10d-1139-426f-ad18-af8e855fcb57','3a7e2399-17fd-4a8f-af43-d66fde9e0539','Central',2,2,'2023-05-31 18:22:17','2023-05-31 18:22:17')
    ON CONFLICT(id_registrymembershipregionid) DO NOTHING;
    
    INSERT INTO registry_membership_region_table(id_registrymembershipregionid,registry_id_companyid,membership_region,membership_region_number,membership_region_display_order,created,modified)
    VALUES ('143178af-8a9a-4eb1-9298-1892081ed3dd','3a7e2399-17fd-4a8f-af43-d66fde9e0539','Mountain',3,3,'2023-05-31 18:22:17','2023-05-31 18:22:17')
    ON CONFLICT(id_registrymembershipregionid) DO NOTHING;
    
    INSERT INTO registry_membership_region_table(id_registrymembershipregionid,registry_id_companyid,membership_region,membership_region_number,membership_region_display_order,created,modified)
    VALUES ('7a9c0bcd-8256-4624-b587-63a55003544f','3a7e2399-17fd-4a8f-af43-d66fde9e0539','Pacific',4,4,'2023-05-31 18:22:17','2023-05-31 18:22:17')
    ON CONFLICT(id_registrymembershipregionid) DO NOTHING;
    
    INSERT INTO registry_membership_region_table(id_registrymembershipregionid,registry_id_companyid,membership_region,membership_region_number,membership_region_display_order,created,modified)
    VALUES ('75d1b75f-26f7-4eb0-8c12-8eb4e1271e5f','3a7e2399-17fd-4a8f-af43-d66fde9e0539','Alaskan',5,5,'2023-05-31 18:22:17','2023-05-31 18:22:17')
    ON CONFLICT(id_registrymembershipregionid) DO NOTHING;
    
    INSERT INTO registry_membership_region_table(id_registrymembershipregionid,registry_id_companyid,membership_region,membership_region_number,membership_region_display_order,created,modified)
    VALUES ('6a5690ef-ba24-4e86-8500-03e65d06d84d','3a7e2399-17fd-4a8f-af43-d66fde9e0539','Hawaii-Aleutian',6,6,'2023-05-31 18:22:17','2023-05-31 18:22:17')
    ON CONFLICT(id_registrymembershipregionid) DO NOTHING;
    
    INSERT INTO registry_membership_region_table(id_registrymembershipregionid,registry_id_companyid,membership_region,membership_region_number,membership_region_display_order,created,modified)
    VALUES ('9ec307d5-cb78-4f2a-801a-6aa318a4d1b4','3a7e2399-17fd-4a8f-af43-d66fde9e0539','Canada',7,7,'2023-05-31 18:22:17','2023-05-31 18:22:17')
    ON CONFLICT(id_registrymembershipregionid) DO NOTHING;
    
    INSERT INTO registry_membership_region_table(id_registrymembershipregionid,registry_id_companyid,membership_region,membership_region_number,membership_region_display_order,created,modified)
    VALUES ('a6240087-e8ce-44bc-8eed-d7a893a9d372','3a7e2399-17fd-4a8f-af43-d66fde9e0539','Overseas',8,8,'2023-05-31 18:22:17','2023-05-31 18:22:17')
    ON CONFLICT(id_registrymembershipregionid) DO NOTHING;
    
    INSERT INTO registry_membership_region_table(id_registrymembershipregionid,registry_id_companyid,membership_region,membership_region_number,membership_region_display_order,created,modified)
    VALUES ('0dc37fd4-3e6c-40c1-b882-bff5780933f6','ff8c7427-e235-4d5a-b218-00767ef8ae1b','North East',1,1,'2025-12-13 12:48:33','2025-12-13 12:48:33')
    ON CONFLICT(id_registrymembershipregionid) DO NOTHING;
    
    INSERT INTO registry_membership_region_table(id_registrymembershipregionid,registry_id_companyid,membership_region,membership_region_number,membership_region_display_order,created,modified)
    VALUES ('22cde7d1-ac42-48fc-b648-bfeec15bd384','ff8c7427-e235-4d5a-b218-00767ef8ae1b','South east',2,2,'2025-12-13 12:48:33','2025-12-13 12:48:33')
    ON CONFLICT(id_registrymembershipregionid) DO NOTHING;
    
    INSERT INTO registry_membership_region_table(id_registrymembershipregionid,registry_id_companyid,membership_region,membership_region_number,membership_region_display_order,created,modified)
    VALUES ('229d5055-5777-4e41-bc6c-f64673df9fa3','ff8c7427-e235-4d5a-b218-00767ef8ae1b','Mid West',3,3,'2025-12-13 12:48:33','2025-12-13 12:48:33')
    ON CONFLICT(id_registrymembershipregionid) DO NOTHING;
    
    INSERT INTO registry_membership_region_table(id_registrymembershipregionid,registry_id_companyid,membership_region,membership_region_number,membership_region_display_order,created,modified)
    VALUES ('c250733c-65a0-4744-ba21-910646dd552f','ff8c7427-e235-4d5a-b218-00767ef8ae1b','South West',4,4,'2025-12-13 12:48:33','2025-12-13 12:48:33')
    ON CONFLICT(id_registrymembershipregionid) DO NOTHING;
    
    INSERT INTO registry_membership_region_table(id_registrymembershipregionid,registry_id_companyid,membership_region,membership_region_number,membership_region_display_order,created,modified)
    VALUES ('00d972f0-b87b-4dfc-9f44-61e468aa7b25','ff8c7427-e235-4d5a-b218-00767ef8ae1b','West',5,5,'2025-12-13 12:48:33','2025-12-13 12:48:33')
    ON CONFLICT(id_registrymembershipregionid) DO NOTHING;
    
    INSERT INTO registry_membership_region_table(id_registrymembershipregionid,registry_id_companyid,membership_region,membership_region_number,membership_region_display_order,created,modified)
    VALUES ('118a356f-8879-4342-86f2-7475b9d06e13','ff8c7427-e235-4d5a-b218-00767ef8ae1b','Europe',6,6,'2025-12-13 12:48:33','2025-12-13 12:48:33')
    ON CONFLICT(id_registrymembershipregionid) DO NOTHING;
    
    INSERT INTO registry_membership_region_table(id_registrymembershipregionid,registry_id_companyid,membership_region,membership_region_number,membership_region_display_order,created,modified)
    VALUES ('39ad545d-c4a4-406c-81eb-bd56bcf1557f','ff8c7427-e235-4d5a-b218-00767ef8ae1b','Unknown',7,7,'2025-12-13 12:48:33','2025-12-13 12:48:33')
    ON CONFLICT(id_registrymembershipregionid) DO NOTHING;
    
    --------------------------------------------------------------------------------------
    -- Add additional registry_membership_status_table seed data
    --------------------------------------------------------------------------------------
    
    -- Do nothing on conflicts as the rows are new and we are only interested in idempotence for the script.
    
    INSERT INTO registry_membership_status_table(id_registrymembershipstatusid,registry_id_companyid,membership_status,membership_status_abbrev,membership_status_display_order,created,modified)
    VALUES ('3c864221-7e0a-4cca-95b1-cdff9a868781','3a7e2399-17fd-4a8f-af43-d66fde9e0539','On Hold','H',2,'2023-05-31 19:24:26','2023-05-31 19:24:26')
    ON CONFLICT(id_registrymembershipstatusid) DO NOTHING;
    
    INSERT INTO registry_membership_status_table(id_registrymembershipstatusid,registry_id_companyid,membership_status,membership_status_abbrev,membership_status_display_order,created,modified)
    VALUES ('bc2c9ee7-7bc9-4bbb-b96c-05e0e444ae84','3a7e2399-17fd-4a8f-af43-d66fde9e0539','Active','A',1,'2023-05-31 19:24:26','2023-05-31 19:24:26')
    ON CONFLICT(id_registrymembershipstatusid) DO NOTHING;
    
    INSERT INTO registry_membership_status_table(id_registrymembershipstatusid,registry_id_companyid,membership_status,membership_status_abbrev,membership_status_display_order,created,modified)
    VALUES ('4ae20766-d1e1-46f1-8e2e-9decbbc6acec','3a7e2399-17fd-4a8f-af43-d66fde9e0539','Resigned','R',3,'2023-05-31 19:24:26','2023-05-31 19:24:26')
    ON CONFLICT(id_registrymembershipstatusid) DO NOTHING;
    
    INSERT INTO registry_membership_status_table(id_registrymembershipstatusid,registry_id_companyid,membership_status,membership_status_abbrev,membership_status_display_order,created,modified)
    VALUES ('d43055d2-c992-498a-945e-da8ce5badcc3','3a7e2399-17fd-4a8f-af43-d66fde9e0539','Pending','P',4,'2024-09-22 13:34:58','2024-09-22 13:34:58')
    ON CONFLICT(id_registrymembershipstatusid) DO NOTHING;
    
    INSERT INTO registry_membership_status_table(id_registrymembershipstatusid,registry_id_companyid,membership_status,membership_status_abbrev,membership_status_display_order,created,modified)
    VALUES ('57f1d987-65a4-4fa9-b925-aa750a1e90a7','5d89623c-0711-4881-b9cf-296bab9f95cb','Active','A',1,'2025-03-15 10:34:29','2025-03-15 10:34:29')
    ON CONFLICT(id_registrymembershipstatusid) DO NOTHING;
    
    INSERT INTO registry_membership_status_table(id_registrymembershipstatusid,registry_id_companyid,membership_status,membership_status_abbrev,membership_status_display_order,created,modified)
    VALUES ('16e0cbaf-393e-4307-a67c-6ab9be393221','5d89623c-0711-4881-b9cf-296bab9f95cb','Resigned','R',2,'2025-03-15 10:34:29','2025-03-15 10:34:29')
    ON CONFLICT(id_registrymembershipstatusid) DO NOTHING;
    
    INSERT INTO registry_membership_status_table(id_registrymembershipstatusid,registry_id_companyid,membership_status,membership_status_abbrev,membership_status_display_order,created,modified)
    VALUES ('c685ab4f-3873-4f7f-9325-ca2b135285c4','ff8c7427-e235-4d5a-b218-00767ef8ae1b','Current','C',1,'2025-12-13 12:48:33','2025-12-13 12:48:33')
    ON CONFLICT(id_registrymembershipstatusid) DO NOTHING;
    
    INSERT INTO registry_membership_status_table(id_registrymembershipstatusid,registry_id_companyid,membership_status,membership_status_abbrev,membership_status_display_order,created,modified) 
    VALUES ('9edf2d2a-6eb2-41c0-a15b-72acf24f0916','ff8c7427-e235-4d5a-b218-00767ef8ae1b','Potential','P',2,'2025-12-13 12:48:33','2025-12-13 12:48:33')
    ON CONFLICT(id_registrymembershipstatusid) DO NOTHING;
    
    INSERT INTO registry_membership_status_table(id_registrymembershipstatusid,registry_id_companyid,membership_status,membership_status_abbrev,membership_status_display_order,created,modified)
    VALUES ('2a78e5dc-04ee-43ff-830e-2ba025268df1','ff8c7427-e235-4d5a-b218-00767ef8ae1b','Lapsed','L',3,'2025-12-13 12:48:33','2025-12-13 12:48:33')
    ON CONFLICT(id_registrymembershipstatusid) DO NOTHING;
    
    INSERT INTO registry_membership_status_table(id_registrymembershipstatusid,registry_id_companyid,membership_status,membership_status_abbrev,membership_status_display_order,created,modified)
    VALUES ('ca3d521f-9117-4988-b40f-eff39c961eeb','ff8c7427-e235-4d5a-b218-00767ef8ae1b','Resigned','R',2,'2025-12-13 12:48:33','2025-12-13 12:48:33')
    ON CONFLICT(id_registrymembershipstatusid) DO NOTHING;
    
    --------------------------------------------------------------------------------------
    -- Add additional registry_membership_type_table seed data
    --------------------------------------------------------------------------------------
    
    -- Do nothing on conflicts as the rows are new and we are only interested in idempotence for the script.
    
    INSERT INTO registry_membership_type_table(id_registrymembershiptypeid,registry_id_companyid,membership_type,membership_type_abbrev,membership_type_display_order,created,modified)
    VALUES ('3e5cdef1-ed35-4209-af35-91241e14594c','3a7e2399-17fd-4a8f-af43-d66fde9e0539','Full','F',1,'2023-11-25 09:25:00','2025-07-05 10:04:09')
    ON CONFLICT(id_registrymembershiptypeid) DO NOTHING;
    
    INSERT INTO registry_membership_type_table(id_registrymembershiptypeid,registry_id_companyid,membership_type,membership_type_abbrev,membership_type_display_order,created,modified)
    VALUES ('d5da34a8-6145-4d3b-84f5-c7acbc706111','3a7e2399-17fd-4a8f-af43-d66fde9e0539','Associate','A',2,'2023-11-25 09:25:00','2025-07-05 10:04:09')
    ON CONFLICT(id_registrymembershiptypeid) DO NOTHING;
    
    INSERT INTO registry_membership_type_table(id_registrymembershiptypeid,registry_id_companyid,membership_type,membership_type_abbrev,membership_type_display_order,created,modified)
    VALUES ('305d3c29-a62f-4904-8516-94d6cee3e495','3a7e2399-17fd-4a8f-af43-d66fde9e0539','Youth','Y',3,'2023-11-25 09:25:00','2025-07-05 10:04:09')
    ON CONFLICT(id_registrymembershiptypeid) DO NOTHING;
    
    INSERT INTO registry_membership_type_table(id_registrymembershiptypeid,registry_id_companyid,membership_type,membership_type_abbrev,membership_type_display_order,created,modified)
    VALUES ('69deb743-dd25-42d1-a466-69e6ea702d8f','3a7e2399-17fd-4a8f-af43-d66fde9e0539','Life','L',4,'2023-11-25 09:25:00','2025-07-05 10:04:09')
    ON CONFLICT(id_registrymembershiptypeid) DO NOTHING;
    
    INSERT INTO registry_membership_type_table(id_registrymembershiptypeid,registry_id_companyid,membership_type,membership_type_abbrev,membership_type_display_order,created,modified)
    VALUES ('96328595-e24a-441b-995a-120dfb33d10b','3a7e2399-17fd-4a8f-af43-d66fde9e0539','Overseas','O',5,'2023-11-25 09:25:00','2025-07-05 10:04:09')
    ON CONFLICT(id_registrymembershiptypeid) DO NOTHING;
    
    INSERT INTO registry_membership_type_table(id_registrymembershiptypeid,registry_id_companyid,membership_type,membership_type_abbrev,membership_type_display_order,created,modified)
    VALUES ('8445d7ac-c31a-48e1-8187-78fc104c76f6','ff8c7427-e235-4d5a-b218-00767ef8ae1b','Senior Founding','SF',1,'2025-12-13 12:48:33','2025-12-13 12:48:33')
    ON CONFLICT(id_registrymembershiptypeid) DO NOTHING;
    
    INSERT INTO registry_membership_type_table(id_registrymembershiptypeid,registry_id_companyid,membership_type,membership_type_abbrev,membership_type_display_order,created,modified)
    VALUES ('f927b3e6-ac10-4225-9c48-11d90d39de10','ff8c7427-e235-4d5a-b218-00767ef8ae1b','Senior','S',2,'2025-12-13 12:48:33','2025-12-13 12:48:33')
    ON CONFLICT(id_registrymembershiptypeid) DO NOTHING;
    
    INSERT INTO registry_membership_type_table(id_registrymembershiptypeid,registry_id_companyid,membership_type,membership_type_abbrev,membership_type_display_order,created,modified)
    VALUES ('11bb06f4-441b-469e-ba62-cbab1466f03b','ff8c7427-e235-4d5a-b218-00767ef8ae1b','Senior Retired','SR',3,'2025-12-13 12:48:33','2025-12-13 12:48:33')
    ON CONFLICT(id_registrymembershiptypeid) DO NOTHING;
    
    INSERT INTO registry_membership_type_table(id_registrymembershiptypeid,registry_id_companyid,membership_type,membership_type_abbrev,membership_type_display_order,created,modified)
    VALUES ('76e3d277-c50d-49b4-b785-c8a8bcc0a3bb','ff8c7427-e235-4d5a-b218-00767ef8ae1b','Associate Registry','AR',4,'2025-12-13 12:48:33','2025-12-13 12:48:33')
    ON CONFLICT(id_registrymembershiptypeid) DO NOTHING;
    
    INSERT INTO registry_membership_type_table(id_registrymembershiptypeid,registry_id_companyid,membership_type,membership_type_abbrev,membership_type_display_order,created,modified)
    VALUES ('b87a001d-a7d4-4cb0-bbe5-777813ff4b27','ff8c7427-e235-4d5a-b218-00767ef8ae1b','Associate','A',5,'2025-12-13 12:48:33','2025-12-13 12:48:33')
    ON CONFLICT(id_registrymembershiptypeid) DO NOTHING;
    
    INSERT INTO registry_membership_type_table(id_registrymembershiptypeid,registry_id_companyid,membership_type,membership_type_abbrev,membership_type_display_order,created,modified)
    VALUES ('07a8e5f2-9150-475d-90d7-c4ab95089bce','ff8c7427-e235-4d5a-b218-00767ef8ae1b','Junior','J',6,'2025-12-13 12:48:33','2025-12-13 12:48:33')
    ON CONFLICT(id_registrymembershiptypeid) DO NOTHING;
    
    INSERT INTO registry_membership_type_table(id_registrymembershiptypeid,registry_id_companyid,membership_type,membership_type_abbrev,membership_type_display_order,created,modified)
    VALUES ('9247ae25-e774-4e1f-b047-923899f0d917','ff8c7427-e235-4d5a-b218-00767ef8ae1b','Non Member','N',7,'2025-12-21 07:53:43','2025-12-21 07:53:43')
    ON CONFLICT(id_registrymembershiptypeid) DO NOTHING;
    
    --------------------------------------------------------------------------------------
    -- Add additional registry_privacy_table seed data
    --------------------------------------------------------------------------------------
    
    -- Do nothing on conflicts as the rows are new and we are only interested in idempotence for the script.
    
    INSERT INTO registry_privacy_table(id_registryprivacyid,registry_id_companyid,registry_privacy,created,modified)
    VALUES ('c3a16484-1044-4241-b69a-de4901c16a20','3a7e2399-17fd-4a8f-af43-d66fde9e0539','Include Everything','2023-05-23 13:43:44','2023-05-23 13:43:44')
    ON CONFLICT(id_registryprivacyid) DO NOTHING;
    
    INSERT INTO registry_privacy_table(id_registryprivacyid,registry_id_companyid,registry_privacy,created,modified)
    VALUES ('ed0c3d33-a419-41bb-8142-0795d040ac9c','3a7e2399-17fd-4a8f-af43-d66fde9e0539','Basic Only-Name, Region, Prefix and Member Number','2023-05-23 13:43:44','2023-05-23 13:43:44')
    ON CONFLICT(id_registryprivacyid) DO NOTHING;
    
    INSERT INTO registry_privacy_table(id_registryprivacyid,registry_id_companyid,registry_privacy,created,modified)
    VALUES ('b004e8a4-2bb0-4bf7-a195-912d6792e99d','3a7e2399-17fd-4a8f-af43-d66fde9e0539','Basic Contact-Add Primary email, Primary phone and Website','2023-05-23 13:43:44','2023-05-23 13:43:44')
    ON CONFLICT(id_registryprivacyid) DO NOTHING;
    
    INSERT INTO registry_privacy_table(id_registryprivacyid,registry_id_companyid,registry_privacy,created,modified)
    VALUES ('4506938e-b456-462e-b834-64ed7a0dcca0','3a7e2399-17fd-4a8f-af43-d66fde9e0539','Exclude Everything','2023-05-23 13:43:44','2023-05-23 13:43:44')
    ON CONFLICT(id_registryprivacyid) DO NOTHING;
    
    INSERT INTO registry_privacy_table(id_registryprivacyid,registry_id_companyid,registry_privacy,created,modified)
    VALUES ('868f388a-2021-428a-a8df-1a8e26faf100','ff8c7427-e235-4d5a-b218-00767ef8ae1b','Include Everything','2025-12-13 12:48:33','2025-12-13 12:48:33')
    ON CONFLICT(id_registryprivacyid) DO NOTHING;
    
    INSERT INTO registry_privacy_table(id_registryprivacyid,registry_id_companyid,registry_privacy,created,modified)
    VALUES ('4c18f453-baf9-4e7e-b9b1-5130428d56da','ff8c7427-e235-4d5a-b218-00767ef8ae1b','Basic Only-Name, Region, Prefix and Member Number','2025-12-13 12:48:33','2025-12-13 12:48:33')
    ON CONFLICT(id_registryprivacyid) DO NOTHING;
    
    INSERT INTO registry_privacy_table(id_registryprivacyid,registry_id_companyid,registry_privacy,created,modified)
    VALUES ('f94a01ac-f0f8-4455-9729-ca18915ea381','ff8c7427-e235-4d5a-b218-00767ef8ae1b','Exclude Everything','2025-12-13 12:48:33','2025-12-13 12:48:33')
    ON CONFLICT(id_registryprivacyid) DO NOTHING;
    
    --------------------------------------------------------------------------------------
    -- Add additional saved_evaluations_table seed data
    --------------------------------------------------------------------------------------
    
    -- Do nothing on conflicts as the rows are new and we are only interested in idempotence for the script.
    
    INSERT INTO saved_evaluations_table(id_savedevaluationsid,evaluation_name,saved_evaluation_id_contactid,saved_evaluation_id_companyid,trait_name01,trait_name02,trait_name03,trait_name04,trait_name05,trait_name06,trait_name07,trait_name08,trait_name09,trait_name10,trait_name11,trait_name12,trait_name13,trait_name14,trait_name15,trait_units11,trait_units12,trait_units13,trait_units14,trait_units15,trait_name16,trait_name17,trait_name18,trait_name19,trait_name20,trait_name01_deferred,trait_name02_deferred,trait_name03_deferred,trait_name04_deferred,trait_name05_deferred,trait_name06_deferred,trait_name07_deferred,trait_name08_deferred,trait_name09_deferred,trait_name10_deferred,trait_name11_deferred,trait_name12_deferred,trait_name13_deferred,trait_name14_deferred,trait_name15_deferred,trait_name16_deferred,trait_name17_deferred,trait_name18_deferred,trait_name19_deferred,trait_name20_deferred,trait_name01_optional,trait_name02_optional,trait_name03_optional,trait_name04_optional,trait_name05_optional,trait_name06_optional,trait_name07_optional,trait_name08_optional,trait_name09_optional,trait_name10_optional,trait_name11_optional,trait_name12_optional,trait_name13_optional,trait_name14_optional,trait_name15_optional,trait_name16_optional,trait_name17_optional,trait_name18_optional,trait_name19_optional,trait_name20_optional,add_alert_summary,created,modified,is_system_only)
    VALUES ('45bd41c7-a87c-4e85-b230-09f3d2c4a0d2','OFDA 2000 Part 1',NULL,'ed382247-5cef-48ea-b7fe-b09491dc9ad6',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'f4942e41-09d7-4c74-9d16-9dd45c840772','9fb1feaf-3be3-4f4f-9407-32b132cd4140','cb398b20-6907-42c0-9cdc-9781517a38d3','fb42c442-ebc9-4cc9-803a-ac94ea13b3ac','4f9d7f18-c6cf-4ba7-8d6f-3b8b260631e5','38907ea4-e6a5-4e64-bf6d-6fcb0dc028d1','38907ea4-e6a5-4e64-bf6d-6fcb0dc028d1','38907ea4-e6a5-4e64-bf6d-6fcb0dc028d1','38907ea4-e6a5-4e64-bf6d-6fcb0dc028d1','38907ea4-e6a5-4e64-bf6d-6fcb0dc028d1',NULL,NULL,NULL,NULL,NULL,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'2025-12-04 05:54:36','2025-12-04 05:54:36',1)
    ON CONFLICT(id_savedevaluationsid) DO NOTHING;
    
    INSERT INTO saved_evaluations_table(id_savedevaluationsid,evaluation_name,saved_evaluation_id_contactid,saved_evaluation_id_companyid,trait_name01,trait_name02,trait_name03,trait_name04,trait_name05,trait_name06,trait_name07,trait_name08,trait_name09,trait_name10,trait_name11,trait_name12,trait_name13,trait_name14,trait_name15,trait_units11,trait_units12,trait_units13,trait_units14,trait_units15,trait_name16,trait_name17,trait_name18,trait_name19,trait_name20,trait_name01_deferred,trait_name02_deferred,trait_name03_deferred,trait_name04_deferred,trait_name05_deferred,trait_name06_deferred,trait_name07_deferred,trait_name08_deferred,trait_name09_deferred,trait_name10_deferred,trait_name11_deferred,trait_name12_deferred,trait_name13_deferred,trait_name14_deferred,trait_name15_deferred,trait_name16_deferred,trait_name17_deferred,trait_name18_deferred,trait_name19_deferred,trait_name20_deferred,trait_name01_optional,trait_name02_optional,trait_name03_optional,trait_name04_optional,trait_name05_optional,trait_name06_optional,trait_name07_optional,trait_name08_optional,trait_name09_optional,trait_name10_optional,trait_name11_optional,trait_name12_optional,trait_name13_optional,trait_name14_optional,trait_name15_optional,trait_name16_optional,trait_name17_optional,trait_name18_optional,trait_name19_optional,trait_name20_optional,add_alert_summary,created,modified,is_system_only)
    VALUES ('6b3a3887-f98c-42eb-91b7-9524edb76bf4','OFDA 2000 Part 2',NULL,'ed382247-5cef-48ea-b7fe-b09491dc9ad6',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'644651d7-e3aa-41e2-8a2d-1fad7bcca493',NULL,NULL,NULL,NULL,'faf4f207-16e0-4367-87b5-45d679fb8399',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'2025-12-04 05:54:36','2025-12-04 05:54:36',1)
    ON CONFLICT(id_savedevaluationsid) DO NOTHING;
    
    --------------------------------------------------------------------------------------
    -- Insert and update state_table seed data
    --------------------------------------------------------------------------------------
    
    -- Doing upserts as there are inserts and updates that are rotating names and display orders, etc.
    
    INSERT INTO state_table (id_stateid,state_name,state_abbrev,id_countryid,state_display_order,created,modified)
    VALUES ('565f65df-797f-472e-85ec-fc08b90ad366', 'Breconshire', 'BRE', '3cbe355a-b195-4ec2-aad6-e5ec3b5a12a7', 65, '2024-01-08 07:15:26', '2024-01-08 07:15:26')
    ON CONFLICT(id_stateid) DO UPDATE SET state_name = excluded.state_name,state_abbrev = excluded.state_abbrev,id_countryid = excluded.id_countryid,state_display_order = excluded.state_display_order,created = excluded.created,modified = excluded.modified;
    
    INSERT INTO state_table (id_stateid,state_name,state_abbrev,id_countryid,state_display_order,created,modified)
    VALUES ('f00dd2ae-6394-45e0-9ada-4fe397f972e8', 'Buckinghamshire', 'BKM', '3cbe355a-b195-4ec2-aad6-e5ec3b5a12a7', 66, '2023-11-26 11:36:18', '2023-11-26 11:36:18')
    ON CONFLICT(id_stateid) DO UPDATE SET state_name = excluded.state_name,state_abbrev = excluded.state_abbrev,id_countryid = excluded.id_countryid,state_display_order = excluded.state_display_order,created = excluded.created,modified = excluded.modified;
    
    INSERT INTO state_table (id_stateid,state_name,state_abbrev,id_countryid,state_display_order,created,modified)
    VALUES ('ac2618ed-7923-47ee-8381-ac2579ab2c2e','Cornwall','CON','3cbe355a-b195-4ec2-aad6-e5ec3b5a12a7', 67, '2025-12-19 14:10:33','2025-12-19 14:10:33')
    ON CONFLICT(id_stateid) DO UPDATE SET state_name = excluded.state_name,state_abbrev = excluded.state_abbrev,id_countryid = excluded.id_countryid,state_display_order = excluded.state_display_order,created = excluded.created,modified = excluded.modified;
    
    INSERT INTO state_table (id_stateid,state_name,state_abbrev,id_countryid,state_display_order,created,modified)
    VALUES ('6d5b8188-9b0a-4585-b3ec-e34a2b6322c6', 'Devon', 'DEV', '3cbe355a-b195-4ec2-aad6-e5ec3b5a12a7', 68, '2023-11-26 11:36:18', '2023-11-26 11:36:18')
    ON CONFLICT(id_stateid) DO UPDATE SET state_name = excluded.state_name,state_abbrev = excluded.state_abbrev,id_countryid = excluded.id_countryid,state_display_order = excluded.state_display_order,created = excluded.created,modified = excluded.modified;
    
    INSERT INTO state_table (id_stateid,state_name,state_abbrev,id_countryid,state_display_order,created,modified)
    VALUES ('571c1817-4c83-4da3-9131-9d87a6d51381','Dorset','DOR','3cbe355a-b195-4ec2-aad6-e5ec3b5a12a7', 69, '2025-12-04 05:54:36','2025-12-04 05:54:36')
    ON CONFLICT(id_stateid) DO UPDATE SET state_name = excluded.state_name,state_abbrev = excluded.state_abbrev,id_countryid = excluded.id_countryid,state_display_order = excluded.state_display_order,created = excluded.created,modified = excluded.modified;
    
    INSERT INTO state_table (id_stateid,state_name,state_abbrev,id_countryid,state_display_order,created,modified)
    VALUES ('b7a26f5a-3806-4875-952a-51d960f92bb3','Durham','DUR','3cbe355a-b195-4ec2-aad6-e5ec3b5a12a7', 70, '2025-12-19 14:10:33','2025-12-19 14:10:33')
    ON CONFLICT(id_stateid) DO UPDATE SET state_name = excluded.state_name,state_abbrev = excluded.state_abbrev,id_countryid = excluded.id_countryid,state_display_order = excluded.state_display_order,created = excluded.created,modified = excluded.modified;
    
    INSERT INTO state_table (id_stateid,state_name,state_abbrev,id_countryid,state_display_order,created,modified)
    VALUES ('e751d809-7112-4f84-a51e-a60a5409ef7c','East Lothian','ELN','3cbe355a-b195-4ec2-aad6-e5ec3b5a12a7', 71, '2025-12-19 14:10:33','2025-12-19 14:10:33')
    ON CONFLICT(id_stateid) DO UPDATE SET state_name = excluded.state_name,state_abbrev = excluded.state_abbrev,id_countryid = excluded.id_countryid,state_display_order = excluded.state_display_order,created = excluded.created,modified = excluded.modified;
    
    INSERT INTO state_table (id_stateid,state_name,state_abbrev,id_countryid,state_display_order,created,modified)
    VALUES ('fdc434bf-a1d1-48fb-b650-854e06898f6c', 'Gwynedd', 'GWN', '3cbe355a-b195-4ec2-aad6-e5ec3b5a12a7', 72, '2023-11-26 11:36:18', '2023-11-26 11:36:18')
    ON CONFLICT(id_stateid) DO UPDATE SET state_name = excluded.state_name,state_abbrev = excluded.state_abbrev,id_countryid = excluded.id_countryid,state_display_order = excluded.state_display_order,created = excluded.created,modified = excluded.modified;
    
    INSERT INTO state_table (id_stateid,state_name,state_abbrev,id_countryid,state_display_order,created,modified)
    VALUES ('4623d520-da11-4316-81b8-4435ec1fc4be', 'Somerset', 'SOM', '3cbe355a-b195-4ec2-aad6-e5ec3b5a12a7', 73, '2023-11-26 11:36:18', '2023-11-26 11:36:18')
    ON CONFLICT(id_stateid) DO UPDATE SET state_name = excluded.state_name,state_abbrev = excluded.state_abbrev,id_countryid = excluded.id_countryid,state_display_order = excluded.state_display_order,created = excluded.created,modified = excluded.modified;
    
    INSERT INTO state_table (id_stateid,state_name,state_abbrev,id_countryid,state_display_order,created,modified)
    VALUES ('865a2e42-ac3e-4799-9008-e70c24e0620b','Nottinghamshire','NTT','3cbe355a-b195-4ec2-aad6-e5ec3b5a12a7',74,'2025-12-19 14:10:33','2025-12-19 14:10:33')
    ON CONFLICT(id_stateid) DO UPDATE SET state_name = excluded.state_name,state_abbrev = excluded.state_abbrev,id_countryid = excluded.id_countryid,state_display_order = excluded.state_display_order,created = excluded.created,modified = excluded.modified;
    
    INSERT INTO state_table (id_stateid,state_name,state_abbrev,id_countryid,state_display_order,created,modified)
    VALUES ('6e5b33af-9884-4afa-9981-ea504b27ea0a','West Lothian','WLN','3cbe355a-b195-4ec2-aad6-e5ec3b5a12a7',75,'2025-12-04 05:54:36','2025-12-04 05:54:36')
    ON CONFLICT(id_stateid) DO UPDATE SET state_name = excluded.state_name,state_abbrev = excluded.state_abbrev,id_countryid = excluded.id_countryid,state_display_order = excluded.state_display_order,created = excluded.created,modified = excluded.modified;
    
    --------------------------------------------------------------------------------------
    -- Add additional tissue_sample_container_type_table seed data
    --------------------------------------------------------------------------------------
    
    -- Do nothing on conflicts as the rows are new and we are only interested in idempotence for the script.
    
    INSERT INTO tissue_sample_container_type_table(id_tissuesamplecontainertypeid,tissue_sample_container_name,tissue_sample_container_abbrev,tissue_sample_container_display_order,created,modified)
    VALUES ('46c57df1-e556-4e40-b69f-9ee25a7ff5db','Nitrile Glove','Glove',12,'2025-12-04 05:54:36','2025-12-04 05:54:36')
    ON CONFLICT(id_tissuesamplecontainertypeid) DO NOTHING;
    
    --------------------------------------------------------------------------------------
    -- Add additional units_table seed data
    --------------------------------------------------------------------------------------
    
    -- Do nothing on conflicts as the rows are new and we are only interested in idempotence for the script.
    
    INSERT INTO units_table(id_unitsid,units_name,units_abbrev,id_unitstypeid,units_display_order,created,modified)
    VALUES ('faf4f207-16e0-4367-87b5-45d679fb8399','Millimeter','mm','b7bc82f7-c97d-4cbc-8c9f-bd5388f3e8a5',21,'2025-12-04 05:54:36','2025-12-04 05:54:36')
    ON CONFLICT(id_unitsid) DO NOTHING;      
  `);
}
