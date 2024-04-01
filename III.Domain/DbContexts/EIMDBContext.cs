using System;
using Microsoft.EntityFrameworkCore;
using III.Domain.Common;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using III.Domain.Models;
using System.Reflection.Metadata;


namespace ESEIM.Models
{
    public partial class EIMDBContext : IdentityDbContext<AspNetUser, AspNetRole, string>
    {
        public EIMDBContext(DbContextOptions<EIMDBContext> options) : base(options)
        {
        }
        //BOM
        public virtual DbSet<BOMProductionWarehouseHd> BOMProductionWarehouseHds { get; set; }
        public virtual DbSet<BOMProductionWarehouseDt> BOMProductionWarehouseDts { get; set; }

        //PartyAdmissionProfile
        public virtual DbSet<Family> Families { get; set; }
		public virtual DbSet<IntroducerOfParty> IntroducerOfParties { get; set; }
		public virtual DbSet<Award> Awards { get; set; }
		public virtual DbSet<GoAboard> GoAboards { get; set; }
		public virtual DbSet<WorkingTracking> WorkingTrackings { get; set; }
		public virtual DbSet<TrainingCertificatedPass> TrainingCertificatedPasses { get; set; }
		public virtual DbSet<WarningDisciplined> WarningDisciplineds { get; set; }
		public virtual DbSet<HistorySpecialist> HistorySpecialists { get; set; }
		public virtual DbSet<PartyAdmissionProfile> PartyAdmissionProfiles { get; set; }
		public virtual DbSet<PersonalHistory> PersonalHistories { get; set; }
		public virtual DbSet<SwCustomerReq> SwCustomerReqs { get; set; }
        public virtual DbSet<SwModuleResource> SwModuleResources { get; set; }
        public virtual DbSet<CustomerModuleRequest> CustomerModuleRequests { get; set; }

        public virtual DbSet<Province> Provinces { get; set; }

        public virtual DbSet<District> Districts { get; set; }

        public virtual DbSet<Ward> Wards { get; set; }

        /// <summary>
        /// Define Status Group
        /// </summary>
        ///


        public virtual DbSet<StatusGroup> StatusGroups { get; set; }
        public virtual DbSet<ObjectTypeStatusGroup> ObjectTypeStatusGroups { get; set; }
        

        /// <summary>
        /// Define employee new design
        /// </summary>
        ///
        /// 
        public virtual DbSet<EdmsDynamic> EDMSDynamics { get; set; }
        public virtual DbSet<EdmsDynamicData> EDMSDynamicDatas { get; set; }
        public virtual DbSet<LMSSubject> LMSSubjects { get; set; }
        public virtual DbSet<LmsCourse> LmsCourses { get; set; }
        public virtual DbSet<LmsClass> LmsClasses { get; set; }
        public virtual DbSet<LmsUserClass> LmsUserClasses { get; set; }
        public virtual DbSet<LmsPracticeTestHeader> LmsPracticeTestHeaders { get; set; }
        public virtual DbSet<LmsPracticeTestDetail> LmsPracticeTestDetails { get; set; }
        public virtual DbSet<LmsLectureManagement> LmsLectureManagements { get; set; }
        public virtual DbSet<LmsLectureSubjectCourse> LmsLectureSubjectCourses { get; set; }
        public virtual DbSet<LmsQuizLectureSubjectCourse> LmsQuizLectureSubjectCourses { get; set; }
        public virtual DbSet<LmsSubjectManagement> LmsSubjectManagements { get; set; }
        public virtual DbSet<VSubjectHierachy> VSubjectHieriachies { get; set; }
        public virtual DbSet<LmsTrackDiligence> LmsTrackDiligences { get; set; }
        public virtual DbSet<UserDoExerciseResult> UserDoExerciseResults { get; set; }
        public virtual DbSet<UserLearnSubject> UserLearnSubjects { get; set; }
        public virtual DbSet<UserWishListSubject> UserWishListSubjects { get; set; }
        public virtual DbSet<LmsBoardTask> LmsBoardTasks { get; set; }
        public virtual DbSet<LmsListTask> LmsListTasks { get; set; }
        public virtual DbSet<LmsExamSchedule> LmsExamSchedules { get; set; }
        public virtual DbSet<LmsExamHeader> LmsExamHeaders { get; set; }
        public virtual DbSet<LmsExamDetail> LmsExamDetails { get; set; }
        public virtual DbSet<LmsTutoringSchedule> LmsTutoringSchedules { get; set; }
        public virtual DbSet<LmsTaskUserItemProgress> LmsTaskUserItemProgresses { get; set; }
        public virtual DbSet<LmsTask> LmsTasks { get; set; }
        public virtual DbSet<LmsTaskStudentAssign> LmsTaskStudentAssigns { get; set; }
        public virtual DbSet<LmsMentorMentee> LmsMentorMentees { get; set; }
        public virtual DbSet<LmsMessageNotification> LmsMessageNotifications { get; set; }
        public virtual DbSet<LmsUserMessage> LmsUserMessages { get; set; }
        public virtual DbSet<LmsQuizPoolReference> LmsQuizPoolReferences { get; set; }
        public virtual DbSet<PayScale> PayScales { get; set; }
        public virtual DbSet<CategoryCareer> CategoryCareers { get; set; }
        public virtual DbSet<PayScaleDetail> PayScaleDetails { get; set; }
        public virtual DbSet<CareerCatScale> CareerCatScales { get; set; }
        public virtual DbSet<PayDecisionHeader> PayDecisionHeaders { get; set; }
        public virtual DbSet<PayDecisionDetail> PayDecisionDetails { get; set; }
        public virtual DbSet<StopContractHeader> StopContractHeaders { get; set; }
        public virtual DbSet<StopContractDetail> StopContractDetails { get; set; }
        public virtual DbSet<EmployeeStatusTracking> EmployeeStatusTrackings { get; set; }
        public virtual DbSet<HrEmployeeDecision> HrEmployeeDecisions { get; set; }
        public virtual DbSet<HREmployeeMobilization> HREmployeeMobilizations { get; set; }
        public virtual DbSet<DecisionMovementHeader> DecisionMovementHeaders { get; set; }
        public virtual DbSet<DecisionMovementDetail> DecisionMovementDetails { get; set; }
        public virtual DbSet<DecisionBonusDisciplineHeader> DecisionBonusDisciplineHeaders { get; set; }
        public virtual DbSet<DecisionBonusDisciplineDetail> DecisionBonusDisciplineDetails { get; set; }
        public virtual DbSet<EmployeeCert> EmployeeCerts { get; set; }
        public virtual DbSet<VocaCertCat> VocaCertCats { get; set; }
        public virtual DbSet<PlanRecruitmentHeader> PlanRecruitmentHeaders { get; set; }
        public virtual DbSet<PlanRecruitmentDetail> PlanRecruitmentDetails { get; set; }
        public virtual DbSet<CriteriaRecruitmentCat> CriteriaRecruitmentCats { get; set; }
        public virtual DbSet<CriteriaRecruimentAttrData> CriteriaRecruimentAttrDatas { get; set; }
        public virtual DbSet<PlanExcuteRecruitmentHeader> PlanExcuteRecruitmentHeaders { get; set; }
        public virtual DbSet<PlanExcuteRecruitmentDetail> PlanExcuteRecruitmentDetails { get; set; }
        public virtual DbSet<FileRecruitment> FileRecruitments { get; set; }
        public virtual DbSet<TemplateKeySearchFile> TemplateKeySearchFiles { get; set; }
        public virtual DbSet<UserAccessDataKeyword> UserAccessDataKeywords { get; set; }

        /// <summary>
        /// Define view for chart dashboard
        /// </summary>
        ///
        public virtual DbSet<VAmchartCrawlingLog> VAmchartCrawlingLog { get; set; }
        public virtual DbSet<VAmchartCardWork> VAmchartCardWorks { get; set; }
        public virtual DbSet<VAmchartCustomer> VAmchartCustomers { get; set; }
        public virtual DbSet<VAmchartSupplier> VAmchartSuppliers { get; set; }
        public virtual DbSet<VAmchartProject> VAmchartProjects { get; set; }
        public virtual DbSet<VAmchartBuy> VAmchartBuys { get; set; }
        public virtual DbSet<VAmchartSale> VAmchartSales { get; set; }
        public virtual DbSet<VAmchartDoExercise> VAmchartDoExercises { get; set; }
        public virtual DbSet<VAmchartLearnSubject> VAmchartLearnSubjects { get; set; }
        public virtual DbSet<VAmchartWorkflows> VAmchartWorkflowss { get; set; }
        public virtual DbSet<VAmchartAsset> VAmchartAssets { get; set; }
        public virtual DbSet<VActionCard> VActionCards { get; set; }
        public virtual DbSet<VCountCardWork> VCountCardWorks { get; set; }

        public virtual DbSet<CandidateCvStorage> CandidateCvStorages { get; set; }
        /// <summary>
        /// WorkFlow
        /// </summary>
        ///
        public virtual DbSet<Activity> Activitys { get; set; }
        public virtual DbSet<WorkflowMilestone> WorkflowMilestones { get; set; }
        public virtual DbSet<WorkflowSetting> WorkflowSettings { get; set; }
        public virtual DbSet<WorkflowInstance> WorkflowInstances { get; set; }
        public virtual DbSet<ActivityInstance> ActivityInstances { get; set; }
        public virtual DbSet<WorkflowInstanceRunning> WorkflowInstanceRunnings { get; set; }
        public virtual DbSet<ActivityInstanceObjective> ActivityInstanceObjectives { get; set; }
        public virtual DbSet<ActivityInstFile> ActivityInstFiles { get; set; }
        public virtual DbSet<ActivityFile> ActivityFiles { get; set; }
        public virtual DbSet<ExcuterControlRole> ExcuterControlRoles { get; set; }
        public virtual DbSet<ExcuterControlRoleInst> ExcuterControlRoleInsts { get; set; }
        public virtual DbSet<ActivityTransition> ActivityTransition { get; set; }
        public virtual DbSet<Transition> Transitions { get; set; }
        public virtual DbSet<WfActivityObjectProccessing> WfActivityObjectProccessings { get; set; }
        public virtual DbSet<JobcardDataLogger> JobcardDataLoggers { get; set; }
        public virtual DbSet<FormBiulderCat> FormBiulderCats { get; set; }
        public virtual DbSet<FormControl> FormControls { get; set; }
        public virtual DbSet<WFSharpLibrary> WFSharpLibrarys { get; set; }
        public virtual DbSet<FileVersion> FileVersions { get; set; }
        public virtual DbSet<ActInstanceUserActivity> ActInstanceUserActivitys { get; set; }
        public virtual DbSet<MessageActivity> MessageActivitys { get; set; }
        public virtual DbSet<SubWorkflowInstance> SubWorkflowInstances { get; set; }

        /// <summary>
        /// Amin System management
        /// </summary>
        public virtual DbSet<AdDivision> AdDivisions { get; set; }
        public virtual DbSet<AdAccessLog> AdAccessLogs { get; set; }
        public virtual DbSet<AdActionLog> AdActionLogs { get; set; }
        public virtual DbSet<AdAppFunction> AdAppFunctions { get; set; }
        public virtual DbSet<MobileAppFunction> MobileAppFunctions { get; set; }
        public virtual DbSet<AdApplication> AdApplications { get; set; }
        public virtual DbSet<AdFunction> AdFunctions { get; set; }
        public virtual DbSet<MobileFunction> MobileFunctions { get; set; }
        public virtual DbSet<AdGroupUser> AdGroupUsers { get; set; }
        public virtual DbSet<AdDepartment> AdDepartments { get; set; }
        public virtual DbSet<AdLanguage> AdLanguages { get; set; }
        public virtual DbSet<AdLanguageText> AdLanguageTexts { get; set; }
        public virtual DbSet<AdOrganization> AdOrganizations { get; set; }
        public virtual DbSet<AdParameter> AdParameters { get; set; }
        public virtual DbSet<AdPermission> AdPermissions { get; set; }
        public virtual DbSet<MobilePermission> MobilePermissions { get; set; }
        public virtual DbSet<AdPrivilege> AdPrivileges { get; set; }
        public virtual DbSet<MobilePrivilege> MobilePrivileges { get; set; }
        public virtual DbSet<AdResource> AdResources { get; set; }
        public virtual DbSet<MobileResource> MobileResources { get; set; }
        public virtual DbSet<AdUserInGroup> AdUserInGroups { get; set; }
        public virtual DbSet<AdUserDepartment> AdUserDepartments { get; set; }
        public virtual DbSet<AdAuthoring> AdAuthorings { get; set; }
        public virtual DbSet<FcmToken> FcmTokens { get; set; }
        /// <summary>
        /// Customer
        /// </summary>
        public virtual DbSet<Customers> Customerss { get; set; }
        public virtual DbSet<CustomerFile> CustomerFiles { get; set; }
        public virtual DbSet<CustomerExtend> CustomerExtends { get; set; }
        public virtual DbSet<CustomerReminder> CustomerReminders { get; set; }
        public virtual DbSet<CustomerAppointment> CustomerAppointments { get; set; }
        public virtual DbSet<OrderRequestRaw> OrderRequestRaws { get; set; }
        public virtual DbSet<OrderRequestRawFiles> OrderRequestRawFiless { get; set; }

        // Đánh giá nhà cung cấp
        public virtual DbSet<OrderSupplierReview> OrderSupplierReviews { get; set; }
        public virtual DbSet<OrderSupplierReviewDetail> OrderSupplierReviewDetails { get; set; }
        // Kiểm tra sản phẩm
        public virtual DbSet<ProductQualityInspectionImp> ProductQualityInspectionImps { get; set; }
        public virtual DbSet<ProductQualityInspectionImpDetails> ProductQualityInspectionImpDetails { get; set; }
        // Nạp nhiên liệu vào bình
        public virtual DbSet<CylinkerFuelLoadingHd> CylinkerFuelLoadingHds { get; set; }
        public virtual DbSet<CylinkerFuelLoadingDt> CylinkerFuelLoadingDts { get; set; }

        public virtual DbSet<ProdQcDatasetResults> ProdQcDatasetResults { get; set; }
        //Đóng gói sản phẩm
        public virtual DbSet<PackageObject> PackageObjects { get; set; }
        public virtual DbSet<PackageTicketHd> PackageTicketHds { get; set; }
        public virtual DbSet<PackageTicketDt> PackageTicketDts { get; set; }
        public virtual DbSet<ProductInPallet> ProductInPallets { get; set; }

        /// <summary>
        /// Supplier
        /// </summary>
        public virtual DbSet<Supplier> Suppliers { get; set; }
        public virtual DbSet<SupplierExtend> SupplierExtends { get; set; }
        public virtual DbSet<SupplierFile> SupplierFiles { get; set; }
        public virtual DbSet<SupplierAppointment> SupplierAppointments { get; set; }

        /// <summary>
        ///EDMS
        /// </summary>
        public virtual DbSet<EDMSCategory> EDMSCategorys { get; set; }
        public virtual DbSet<EDMSRepository> EDMSRepositorys { get; set; }
        public virtual DbSet<EDMSCatRepoSetting> EDMSCatRepoSettings { get; set; }
        public virtual DbSet<EDMSRepoCatFile> EDMSRepoCatFiles { get; set; }
        public virtual DbSet<EDMSFile> EDMSFiles { get; set; }
        public virtual DbSet<EDMSFilePermission> EDMSFilePermissions { get; set; }
        public virtual DbSet<EDMSWareHouse> EDMSWareHouses { get; set; }
        public virtual DbSet<EDMSWareHouseUsers> EDMSWareHouseUsers { get; set; }
        public virtual DbSet<EDMSWhsMedia> EDMSWhsMedias { get; set; }
        public virtual DbSet<EDMSWareHouseMedia> EDMSWareHouseMedias { get; set; }
        public virtual DbSet<EDMSFloor> EDMSFloors { get; set; }
        public virtual DbSet<EDMSLine> EDMSLines { get; set; }
        public virtual DbSet<EDMSRack> EDMSRacks { get; set; }
        public virtual DbSet<EDMSBox> EDMSBoxs { get; set; }
        public virtual DbSet<EDMSBoxFile> EDMSBoxFiles { get; set; }
        public virtual DbSet<EDMSBoxTracking> EDMSBoxTrackings { get; set; }
        public virtual DbSet<EDMSEntityMapping> EDMSEntityMappings { get; set; }
        public virtual DbSet<EDMSMoveBoxLog> EDMSMoveBoxLogs { get; set; }
        public virtual DbSet<EDMSWhsQrCode> EDMSWhsQrCodes { get; set; }
        public virtual DbSet<EDMSRequestInputStore> EDMSRequestInputStores { get; set; }
        public virtual DbSet<EDMSRequestEndBox> EDMSRequestEndBoxs { get; set; }
        public virtual DbSet<EDMSReqInputFile> EDMSReqFiles { get; set; }
        public virtual DbSet<EDMSReqExportFile> EDMSReqExportFiles { get; set; }
        public virtual DbSet<EDMSReceiptInputStore> EDMSReceiptInputStores { get; set; }
        public virtual DbSet<EDMSReceiptExportStore> EDMSReceiptExportStores { get; set; }
        public virtual DbSet<EDMSRecInputFile> EDMSRecFiles { get; set; }
        public virtual DbSet<EDMSRecExportFile> EDMSRecExportFiles { get; set; }
        public virtual DbSet<EDMSTermite> EDMSTermites { get; set; }
        public virtual DbSet<EDMSTermiteBox> EDMSTermiteBoxs { get; set; }
        public virtual DbSet<EDMSRemove> EDMSRemoves { get; set; }
        public virtual DbSet<EDMSRemoveBox> EDMSRemoveBoxs { get; set; }
        public virtual DbSet<EDMSTimeOfDocumentPreservation> EDMSTimeOfDocumentPreservations { get; set; }
        public virtual DbSet<EDMSRequestTracking> EDMSRequestTrackings { get; set; }
        public virtual DbSet<EDMSRequestExportStore> EDMSRequestExportStores { get; set; }
        public virtual DbSet<EDMSWarehouseExtend> EDMSWarehouseExtends { get; set; }
        public virtual DbSet<WORKOSAddressCard> WORKOSAddressCards { get; set; }
        public virtual DbSet<JobCardAssignee> JobCardAssignees { get; set; }
        public virtual DbSet<FilesShareObjectUser> FilesShareObjectUsers { get; set; }
        public virtual DbSet<ObjectiverPackCover> ObjectiverPackCovers { get; set; }
        public virtual DbSet<EDMSFilePackCover> EDMSFilePackCovers { get; set; }
        public virtual DbSet<EDMSEntityMappingDocument> EDMSEntityMappingDocuments { get; set; }
        public virtual DbSet<EDMSMoveBoxLogDocument> EDMSMoveBoxLogDocuments { get; set; }
        public virtual DbSet<EDMSWhsQrCodeDocument> EDMSWhsQrCodeDocuments { get; set; }
        public virtual DbSet<EDMSRepoDefaultObject> EDMSRepoDefaultObjects { get; set; }
        public virtual DbSet<EDMSAudioBook> EdmsAudioBooks { get; set; }
        /// <summary>
        /// EDMS Document
        /// </summary>
        public virtual DbSet<EDMSWareHouseDocument> EDMSWareHouseDocuments { get; set; }
        public virtual DbSet<EDMSFloorDocument> EDMSFloorDocuments { get; set; }
        public virtual DbSet<EDMSLineDocument> EDMSLineDocuments { get; set; }
        public virtual DbSet<EDMSRackDocument> EDMSRackDocuments { get; set; }

        /// <summary>
        /// EDMS Asset
        /// </summary>
        public virtual DbSet<EDMSWareHouseAsset> EDMSWareHouseAssets { get; set; }
        public virtual DbSet<EDMSFloorAsset> EDMSFloorAssets { get; set; }
        public virtual DbSet<EDMSLineAsset> EDMSLineAssets { get; set; }
        public virtual DbSet<EDMSRackAsset> EDMSRackAssets { get; set; }
        public virtual DbSet<EDMSEntityMappingAsset> EDMSEntityMappingAssets { get; set; }
        public virtual DbSet<EDMSWhsQrCodeAsset> EDMSWhsQrCodeAssets { get; set; }
        public virtual DbSet<EDMSFilePackCoverAsset> EDMSFilePackCoverAssets { get; set; }
        public virtual DbSet<ObjectiverPackCoverAsset> ObjectiverPackCoverAssets { get; set; }
        public virtual DbSet<AssetEntityMapping> AssetEntityMappings { get; set; }

        /// <summary>
        /// Service
        /// </summary>
        public virtual DbSet<ServiceCategory> ServiceCategorys { get; set; }

        public virtual DbSet<ServiceRegist> ServiceRegists { get; set; }
        public virtual DbSet<ContractServiceDetail> ContractServiceDetails { get; set; }
        public virtual DbSet<ContractServiceDetailHis> ContractServiceDetailHiss { get; set; }
        //public virtual DbSet<ProductCat> ProductCats { get; set; }

        /// <summary>
        /// Notification
        /// </summary>
        public virtual DbSet<Notification> Notifications { get; set; }
        public virtual DbSet<NotificationManager> NotificationManagers { get; set; }
        public virtual DbSet<NotificationObject> NotificationObjects { get; set; }


        /// <summary>
        /// Tracking
        /// </summary>
        public virtual DbSet<UserTrackingGps> UserTrackingGpss { get; set; }
        /// <summary>
        /// Reminder
        /// </summary>
        public virtual DbSet<ReminderAttr> ReminderAttrs { get; set; }

        /// <summary>
        /// Map
        /// </summary>
        public virtual DbSet<MapDataGps> MapDataGpss { get; set; }

        /// <summary>
        /// Contract
        /// </summary>
        public virtual DbSet<PoSaleHeader> PoSaleHeaders { get; set; }
        public virtual DbSet<PoSaleHeaderHis> PoSaleHeaderHiss { get; set; }
        public virtual DbSet<PoSaleHeaderNotDone> PoSaleHeaderNotDones { get; set; }
        public virtual DbSet<ContractDetail> ContractDetails { get; set; }
        public virtual DbSet<ContractFile> ContractFiles { get; set; }
        public virtual DbSet<ContractPeopleTag> ContractPeopleTags { get; set; }
        public virtual DbSet<ContractAttribute> ContractAttributes { get; set; }
        public virtual DbSet<ContractAttributeHis> ContractAttributeHiss { get; set; }
        public virtual DbSet<ContractActivity> ContractActivitys { get; set; }
        public virtual DbSet<Contact> Contacts { get; set; }
        public virtual DbSet<ContactNote> ContactNotes { get; set; }
        public virtual DbSet<ContractMemberTag> ContractMemberTags { get; set; }
        public virtual DbSet<EntityMapping> EntityMappings { get; set; }
        public virtual DbSet<MappingMain> MappingMains { get; set; }
        public virtual DbSet<PoSupAttribute> PoSupAttributes { get; set; }
        public virtual DbSet<ContractSchedulePay> ContractSchedulePays { get; set; }
        public virtual DbSet<ContractSchedulePayHis> ContractSchedulePayHiss { get; set; }
        public virtual DbSet<VHisImpProduct> VHisImpProducts { get; set; }
        public virtual DbSet<VHisProduct> VHisProducts { get; set; }
        public virtual DbSet<VImpExpProduct> VImpExpProducts { get; set; }
        public virtual DbSet<VReportStaticsPoSup> VReportStaticsPoSups { get; set; }
        public virtual DbSet<VProductAllTable> VProductAllTables { get; set; }
        public virtual DbSet<AssignMemberToOject> AssignMemberToOjects { get; set; }

        ///<summary>
        ///Warehouse
        ///</summary>  
        public virtual DbSet<MaterialProduct> MaterialProducts { get; set; }
        public virtual DbSet<MaterialProductGroup> MaterialProductGroups { get; set; }
        public virtual DbSet<MaterialProductAttributeMain> MaterialProductAttributeMains { get; set; }
        public virtual DbSet<PackingType> PackingTypes { get; set; }
        public virtual DbSet<AttrGalaxy> AttrGalaxys { get; set; }
        public virtual DbSet<AttrGalaxyAet> AttrGalaxyAets { get; set; }
        public virtual DbSet<AttributeManager> AttributeManagers { get; set; }
        public virtual DbSet<AssetAttrGalaxy> AssetAttrGalaxys { get; set; }
        public virtual DbSet<ProductAttrGalaxy> ProductAttrGalaxys { get; set; }
        public virtual DbSet<ProductAttrExt> ProductAttrExts { get; set; }
        public virtual DbSet<AttributeManagerGalaxy> AttributeManagerGalaxys { get; set; }
        public virtual DbSet<ProductComponent> ProductComponents { get; set; }
        public virtual DbSet<MaterialProductAttributeChildren> MaterialProductAttributeChildrens { get; set; }
        public virtual DbSet<MaterialProductAssetChildren> MaterialProductAssetChildrens { get; set; }
        public virtual DbSet<MaterialType> MaterialTypes { get; set; }
        public virtual DbSet<MaterialAttribute> MaterialAttributes { get; set; }
        public virtual DbSet<MaterialFile> MaterialFiles { get; set; }
        public virtual DbSet<ProdDeliveryHeader> ProdDeliveryHeaders { get; set; }
        public virtual DbSet<ProdDeliveryDetail> ProdDeliveryDetails { get; set; }
        public virtual DbSet<MaterialStoreBatchGoods> MaterialStoreBatchGoodss { get; set; }
        public virtual DbSet<ProdReceivedHeader> ProdReceivedHeaders { get; set; }
        public virtual DbSet<ProdReceivedDetail> ProdReceivedDetails { get; set; }
        public virtual DbSet<ProdReceivedAttrValue> ProdReceivedAttrValues { get; set; }
        public virtual DbSet<ProdDeliveryAttrValue> ProdDeliveryAttrValues { get; set; }
        public virtual DbSet<StockArrangePutEntry> StockArrangePutEntrys { get; set; }
        public virtual DbSet<StockArrangePopEntry> StockArrangePopEntrys { get; set; }
        public virtual DbSet<MapStockProdIn> MapStockProdIns { get; set; }
        public virtual DbSet<ProdInStockAttrValue> ProdInStockAttrValues { get; set; }
        public virtual DbSet<MaterialInvoice> MaterialInvoices { get; set; }
        public virtual DbSet<CommonSettingGroup> CommonSettingGroups { get; set; }
        public virtual DbSet<CommonSetting> CommonSettings { get; set; }
        public virtual DbSet<LmsCommonSetting> LmsCommonSettings { get; set; }
        //public virtual DbSet<MaterialStore> MaterialStores { get; set; }
        public virtual DbSet<MaterialPaymentTicket> MaterialPaymentTickets { get; set; }
        public virtual DbSet<ProductInStockOld> ProductInStockOlds { get; set; }
        public virtual DbSet<ProductInStockExp> ProductInStockExps { get; set; }
        public virtual DbSet<ForecastProductInStock> ForecastProductInStocks { get; set; }
        public virtual DbSet<ProductEntityMapping> ProductEntityMappings { get; set; }
        public virtual DbSet<ProductEntityMappingLog> ProductEntityMappingLogs { get; set; }
        public virtual DbSet<EDMSMoveProductLog> EDMSMoveProductLogs { get; set; }
        public virtual DbSet<ProductAttribute> ProductAttributes { get; set; }
        public virtual DbSet<MaterialStoreImpGoodsHeader> MaterialStoreImpGoodsHeaders { get; set; }
        public virtual DbSet<MaterialStoreImpGoodsDetail> MaterialStoreImpGoodsDetails { get; set; }
        public virtual DbSet<ProductInStock> ProductInStocks { get; set; }
        public virtual DbSet<ProductLocatedMapping> ProductLocatedMappings { get; set; }
        public virtual DbSet<ProductLocatedMappingLog> ProductLocatedMappingLogs { get; set; }
        public virtual DbSet<ProductImpParent> ProductImpParents { get; set; }
        public virtual DbSet<ProductExpParent> ProductExpParents { get; set; }
        public virtual DbSet<ProductImpGattr> ProductImpGattrs { get; set; }
        public virtual DbSet<ProductImportDetail> ProductImportDetails { get; set; }
        public virtual DbSet<ProductImportHeader> ProductImportHeaders { get; set; }
        public virtual DbSet<ProductExportDetail> ProductExportDetails { get; set; }
        public virtual DbSet<ProductExportHeader> ProductExportHeaders { get; set; }
        public virtual DbSet<ProductGattrExt> ProductGattrExts { get; set; }
        public virtual DbSet<ProductSettingWarning> ProductSettingWarnings { get; set; }

        public virtual DbSet<PoSupHeader> PoSupHeaders { get; set; }
        public virtual DbSet<PoSupHeaderNotDone> PoSupHeaderNotDones { get; set; }
        public virtual DbSet<PoSupHeaderPayment> PoSupHeaderPayments { get; set; }
        public virtual DbSet<Vayxe_Customer> Vayxe_Customer { get; set; }
        //Crawler
        public virtual DbSet<IwindoorKeygenManagement> IwindoorKeygenManagements { get; set; }
        public virtual DbSet<CrawlerDomainConfiguration> CrawlerDomainConfigurations { get; set; }
        public virtual DbSet<CrawlerManageIpRunningBot> CrawlerManageIpRunningBots { get; set; }
        public virtual DbSet<CrawlerInfoFacebookGroup> CrawlerInfoFacebookGroups { get; set; }
        public virtual DbSet<CrawlerDomainConfigurationParam> CrawlerDomainConfigurationParams { get; set; }
        public virtual DbSet<LinkedInDataProfile> LinkedInDataProfiles { get; set; }
        public virtual DbSet<LinkedInInfoData> LinkedInInfoDatas { get; set; }
        public virtual DbSet<LinkedInProfileUrl> LinkedInProfileUrls { get; set; }

        public virtual DbSet<BotSocialManagement> BotSocialManagement { get; set; }
        public virtual DbSet<BotSocialSessionLog> BotSocialSessionLog { get; set; }
        public virtual DbSet<CrawlerKeyWords> CrawlerKeyWords { get; set; }
        public virtual DbSet<BotManagements> BotManagements { get; set; }
       
        public virtual DbSet<ScheduleManagement> ScheduleManagements { get; set; }
        public virtual DbSet<CrawlerRunningLog> CrawlerRunningLogs { get; set; }
        ////2 Bảng yêu cầu đặt hàng mới - theo form mẫu chị Tuyến gửi 2019.06.01
        //public virtual DbSet<RequestOrderHeader> RequestOrderHeaders { get; set; }
        //public virtual DbSet<RequestOrderDetail> RequestOrderDetails { get; set; }

        //2 Bảng yêu cầu đặt hàng cũ - trước khi chị Tuyến gửi form mẫu 2019.06.01
        public virtual DbSet<RequestImpProductHeader> RequestImpProductHeaders { get; set; }
        public virtual DbSet<RequestImpProductDetail> RequestImpProductDetails { get; set; }
        public virtual DbSet<RequestPriceHeader> RequestPriceHeaders { get; set; }
        public virtual DbSet<RequestPriceDetail> RequestPriceDetails { get; set; }
        public virtual DbSet<PoSupRequestImpProduct> PoSupRequestImpProducts { get; set; }
        public virtual DbSet<RequestPoSup> RequestPoSups { get; set; }
        public virtual DbSet<cms_attachments> cms_attachments { get; set; }
        public virtual DbSet<cms_categories> cms_categories { get; set; }
        public virtual DbSet<cms_comments> cms_comments { get; set; }
        public virtual DbSet<cms_extra_fields> cms_extra_fields { get; set; }
        public virtual DbSet<cms_extra_fields_groups> cms_extra_fields_groups { get; set; }
        public virtual DbSet<cms_extra_fields_value> cms_extra_fields_value { get; set; }
        public virtual DbSet<cms_functions> cms_functions { get; set; }
        public virtual DbSet<cms_function_group> cms_function_group { get; set; }
        public virtual DbSet<cms_function_resource> cms_function_resource { get; set; }
        public virtual DbSet<cms_items> cms_items { get; set; }
        public virtual DbSet<cms_rating> cms_rating { get; set; }
        public virtual DbSet<cms_roles> cms_roles { get; set; }
        public virtual DbSet<cms_setting> cms_setting { get; set; }
        public virtual DbSet<cms_tags> cms_tags { get; set; }
        public virtual DbSet<cms_tags_xref> cms_tags_xref { get; set; }
        public virtual DbSet<CommonSettingArticle> CommonSettingArticles { get; set; }
        public virtual DbSet<SettingUserguide> SettingUserguides { get; set; }

        /// <summary>
        /// Asset
        /// </summary>
        public virtual DbSet<Asset> Assets { get; set; }
        public virtual DbSet<AssetAttribute> AssetAttributes { get; set; }
        public virtual DbSet<AssetActivity> AssetAtivitys { get; set; }
        public virtual DbSet<AssetMain> AssetMains { get; set; }
        public virtual DbSet<AssetType> AssetTypes { get; set; }
        public virtual DbSet<AssetGroup> AssetGroups { get; set; }
        public virtual DbSet<AssetInventoryHeader> AssetInventoryHeaders { get; set; }
        public virtual DbSet<AssetInventoryDetail> AssetInventoryDetails { get; set; }
        public virtual DbSet<AssetInventoryFile> AssetInventoryFiles { get; set; }
        public virtual DbSet<AssetAllocateHeader> AssetAllocateHeaders { get; set; }
        public virtual DbSet<AssetAllocateDetail> AssetAllocateDetails { get; set; }
        public virtual DbSet<AssetAllocationFile> AssetAllocationFiles { get; set; }
        public virtual DbSet<AssetBuyHeader> AssetBuyHeaders { get; set; }
        public virtual DbSet<AssetBuyDetail> AssetBuyDetails { get; set; }
        public virtual DbSet<AssetBuyFile> AssetBuyFiles { get; set; }
        public virtual DbSet<AssetTransferHeader> AssetTransferHeaders { get; set; }
        public virtual DbSet<AssetTransferDetail> AssetTransferDetails { get; set; }
        public virtual DbSet<AssetTransferFile> AssetTransferFiles { get; set; }
        public virtual DbSet<AssetRqMaintenanceRepairHeader> AssetRqMaintenanceRepairHeaders { get; set; }
        public virtual DbSet<AssetRqMaintenanceRepairDetail> AssetRqMaintenanceRepairDetails { get; set; }
        public virtual DbSet<AssetRqMaintenanceRepairFile> AssetRqMaintenanceRepairFiles { get; set; }
        public virtual DbSet<AssetMaintenanceHeader> AssetMaintenanceHeaders { get; set; }
        public virtual DbSet<AssetMaintenanceDetails> AssetMaintenanceDetailss { get; set; }
        public virtual DbSet<AssetMaintenanceFile> AssetMaintenanceFiles { get; set; }
        public virtual DbSet<AssetMaintenanceCategory> AssetMaintenanceCategorys { get; set; }
        public virtual DbSet<AssetImprovementHeader> AssetImprovementHeaders { get; set; }
        public virtual DbSet<AssetImprovementDetails> AssetImprovementDetailss { get; set; }
        public virtual DbSet<AssetImprovementFile> AssetImprovementFiles { get; set; }
        public virtual DbSet<AssetImprovementCategory> AssetImprovementCategorys { get; set; }
        public virtual DbSet<AssetCancelHeader> AssetCancelHeaders { get; set; }
        public virtual DbSet<AssetCancelDetail> AssetCancelDetails { get; set; }
        public virtual DbSet<AssetCancelFile> AssetCancelFiles { get; set; }
        public virtual DbSet<AssetLiquidationHeader> AssetLiquidationHeaders { get; set; }
        public virtual DbSet<AssetLiquidationDetail> AssetLiquidationDetails { get; set; }
        public virtual DbSet<AssetLiquidationFile> AssetLiquidationFiles { get; set; }
        public virtual DbSet<AssetRPTBrokenHeader> AssetRPTBrokenHeaders { get; set; }
        public virtual DbSet<AssetRPTBrokenDetails> AssetRPTBrokenDetails { get; set; }
        public virtual DbSet<AssetRPTBrokenFile> AssetRPTBrokenFiles { get; set; }
        public virtual DbSet<AssetRecalledHeader> AssetRecalledHeaders { get; set; }
        public virtual DbSet<AssetRecalledDetail> AssetRecalledDetails { get; set; }
        public virtual DbSet<AssetRecalledFile> AssetRecalledFiles { get; set; }


        /// <summary>
        /// Log Activity new
        /// </summary>
        public virtual DbSet<CatWorkFlow> CatWorkFlows { get; set; }
        public virtual DbSet<CatActivity> CatActivitys { get; set; }
        public virtual DbSet<ActivityLogData> ActivityLogDatas { get; set; }
        public virtual DbSet<ActivityAttrData> ActivityAttrDatas { get; set; }
        public virtual DbSet<AttrSetup> AttrSetups { get; set; }
        public virtual DbSet<WorkflowActivity> ObjectActivitys { get; set; }
        public virtual DbSet<WorkflowActivityRole> WorkflowActivityRoles { get; set; }
        public virtual DbSet<WorkingScheduleAttr> WorkingScheduleAttrs { get; set; }



        /// <summaryF
        /// HR
        /// </summary>
        public virtual DbSet<HRAddress> HRAddress { get; set; }
        public virtual DbSet<HRContact> HRContacts { get; set; }
        public virtual DbSet<HRContract> HRContracts { get; set; }
        public virtual DbSet<HREmployee> HREmployees { get; set; }
        public virtual DbSet<HRTrainingCourse> HRTrainingCourses { get; set; }
        public virtual DbSet<HRWorkFlows> HRWorkFlows { get; set; }
        public virtual DbSet<HRWorkingProcess> HRWorkingProcesss { get; set; }
        public virtual DbSet<HrTranningCourseFile> HrTranningCourseFiles { get; set; }

        /// <summary>
        /// Project
        /// </summary>
        public virtual DbSet<Project> Projects { get; set; }
        public virtual DbSet<ProjectTeam> ProjectTeams { get; set; }
        public virtual DbSet<ProjectCommentList> ProjectCommentLists { get; set; }
        public virtual DbSet<ProjectCustomer> ProjectCustomers { get; set; }
        public virtual DbSet<ProjectGantt> ProjectGantts { get; set; }
        public virtual DbSet<ProjectMember> ProjectMembers { get; set; }
        public virtual DbSet<ProjectFile> ProjectFiles { get; set; }
        public virtual DbSet<ProjectSupplier> ProjectSuppliers { get; set; }
        public virtual DbSet<ProjectNote> ProjectNotes { get; set; }
        public virtual DbSet<ProjectAppointment> ProjectAppointments { get; set; }
        //public virtual DbSet<ProjectBoard> ProjectBoards { get; set; }
        public virtual DbSet<ProjectAttribute> ProjectAttributes { get; set; }
        public virtual DbSet<Team> Teams { get; set; }
        public virtual DbSet<ItemPlanJobcard> ItemPlanJobcards { get; set; }
        public virtual DbSet<ProjectTeamUser> ProjectTeamUsers { get; set; }
        public virtual DbSet<ProjectItemPlan> ProjectItemPlans { get; set; }
        public virtual DbSet<ItemPlanJobcard> ItemPlanJobCards { get; set; }
        public virtual DbSet<ProjectCusSup> ProjectCusSups { get; set; }
        public virtual DbSet<PoSaleProductDetail> PoSaleProductDetails { get; set; }
        public virtual DbSet<ProjectService> ProjectServices { get; set; }
        public virtual DbSet<ProjectServiceHeader> ProjectServiceHeaders { get; set; }
        public virtual DbSet<ProjectServiceDetail> ProjectServiceDetails { get; set; }
        public virtual DbSet<ProjectProduct> ProjectProducts { get; set; }
        public virtual DbSet<ProjectProductHeader> ProjectProductHeaders { get; set; }
        public virtual DbSet<ProjectProductDetail> ProjectProductDetails { get; set; }
        public virtual DbSet<VProjectProductRemain> VProjectProductRemains { get; set; }
        /// <summary>
        /// Card
        /// </summary>
        public virtual DbSet<WORKOSBoard> WORKOSBoards { get; set; }
        public virtual DbSet<WORKOSList> WORKOSLists { get; set; }
        public virtual DbSet<WORKOSCard> WORKOSCards { get; set; }
        public virtual DbSet<CardItemCheck> CardItemChecks { get; set; }
        public virtual DbSet<CardSubitemCheck> CardSubitemChecks { get; set; }
        public virtual DbSet<CardAttachment> CardAttachments { get; set; }
        public virtual DbSet<CardCommentList> CardCommentLists { get; set; }
        public virtual DbSet<LmsTaskCommentList> LmsTaskCommentLists { get; set; }
        public virtual DbSet<CardForWObj> CardForWObjs { get; set; }
        public virtual DbSet<CardMember> CardMembers { get; set; }
        public virtual DbSet<CardGroupUser> CardGroupUsers { get; set; }
        public virtual DbSet<CardUserActivity> CardUserActivities { get; set; }
        public virtual DbSet<CardProduct> CardProducts { get; set; }
        public virtual DbSet<CardMapping> CardMappings { get; set; }
        public virtual DbSet<JcObjectType> JcObjectTypes { get; set; }
        public virtual DbSet<JcObjectIdRelative> JcObjectIdRelatives { get; set; }
        public virtual DbSet<JcProduct> JcProducts { get; set; }
        public virtual DbSet<JcService> JcServices { get; set; }
        public virtual DbSet<SessionWorkResult> SessionWorkResults { get; set; }
        public virtual DbSet<WorkItemAssignStaff> WorkItemAssignStaffs { get; set; }
        public virtual DbSet<SessionWork> SessionWorks { get; set; }
        public virtual DbSet<JobCardLink> JobCardLinks { get; set; }



        /// <summary>
        /// Candidate
        /// </summary>
        public virtual DbSet<CandidateBasic> CandiateBasic { get; set; }
        public virtual DbSet<CandidateWorkEvent> CandidateWorkEvents { get; set; }
        public virtual DbSet<CandidateInterview> CandidateInterviews { get; set; }

        /// <summary>
        /// Staff
        /// </summary>
        public virtual DbSet<CompanyScheduleWork> CompanyScheduleWorks { get; set; }
        public virtual DbSet<StaffScheduleWork> StaffScheduleWorks { get; set; }
        public virtual DbSet<StaffTimeKeeping> StaffTimeKeepings { get; set; }
        public virtual DbSet<WorkShiftCheckInOut> WorkShiftCheckInOuts { get; set; }
        public virtual DbSet<ShiftLog> ShiftLogs { get; set; }
        public virtual DbSet<ShiftLogCamera> ShiftLogCameras { get; set; }
        public virtual DbSet<ShiftLogCard> ShiftLogCards { get; set; }
        public virtual DbSet<VShiftLog> VShiftLogs { get; set; }
        public virtual DbSet<UserDeclareBusyOrFree> UserDeclareBusyOrFrees { get; set; }

        /// <summary>
        /// Keyword
        /// </summary>
        public virtual DbSet<GalaxyKeyword> GalaxyKeywords { get; set; }

        /// <summary>
        /// Google API
        /// </summary>
        public virtual DbSet<TokenManager> TokenManagers { get; set; }
        public virtual DbSet<CountRequestGoogle> CountRequestGoogle { get; set; }

        /// <summary>
        /// Addon app
        /// </summary>
        public virtual DbSet<AddonApp> AddonApps { get; set; }
        public virtual DbSet<AddonAppServer> AddonAppServers { get; set; }
        public virtual DbSet<AppVendor> AppVendors { get; set; }
        public virtual DbSet<HolidayDate> HolidayDates { get; set; }
        public virtual DbSet<MobiFunctionJobCardList> MobiFunctionJobCardLists { get; set; }

        /// <summary>
        /// Dispatches
        /// </summary>
        public virtual DbSet<DispatchesCategory> DispatchesCategorys { get; set; }
        public virtual DbSet<DispatchesHeader> DispatchesHeaders { get; set; }
        public virtual DbSet<DispatchTrackingProcess> DispatchTrackingProcesss { get; set; }
        public virtual DbSet<DispatchesMemberActivity> DispatchesMemberActivitys { get; set; }
        public virtual DbSet<DispatchesFileACT> DispatchesFileACTs { get; set; }
        public virtual DbSet<DispatchesCommentACT> DispatchesCommentACTs { get; set; }
        public virtual DbSet<DispatchesUser> DispatchesUsers { get; set; }
        public virtual DbSet<DispatchesWeekWorkingScheduler> DispatchesWeekWorkingSchedulerss { get; set; }


        /// <summary>
        /// Building
        /// </summary>
        public virtual DbSet<JCKMaterialsComsume> JCKMaterialsComsumes { get; set; }
        public virtual DbSet<JCTrackingBuilding> JCTrackingBuildings { get; set; }
        public virtual DbSet<JCTrackingMedia> JCTrackingMedias { get; set; }
        //public virtual DbSet<ProjectBuilding> ProjectBuildings { get; set; }


        //Face Id
        public virtual DbSet<FaceFaceId> FaceFaceIds { get; set; }

        public virtual DbSet<ObeListDevice> ObelistDevices { get; set; }
        public virtual DbSet<ObeAiRecognitionTracking> ObeAiRecognitionTrackings { get; set; }
        public virtual DbSet<ObeAccount> ObeAccounts { get; set; }


        //Vicem
        public virtual DbSet<VcSupplierTradeRelation> VcSupplierTradeRelations { get; set; }
        public virtual DbSet<VcTransporter> VcTransporters { get; set; }

        public virtual DbSet<VcProductCat> VcProductCats { get; set; }
        public virtual DbSet<VcWorkCheck> VcWorkChecks { get; set; }
        public virtual DbSet<VcSettingRoute> VcSettingRoutes { get; set; }
        public virtual DbSet<VcWorkPlan> VcWorkPlans { get; set; }
        public virtual DbSet<VcWorkPlanLog> VcWorkPlanLogs { get; set; }
        public virtual DbSet<VcCustomerCare> VcCustomerCares { get; set; }
        public virtual DbSet<VcLeaderApprove> VcLeaderApproves { get; set; }
        public virtual DbSet<VcStoreIdea> VcStoreIdeas { get; set; }
        public virtual DbSet<VcCustomerDeclareInfo> VcCustomerDeclareInfos { get; set; }
        public virtual DbSet<VcCustomerDeclareHeaderInfo> VcCustomerDeclareHeaderInfos { get; set; }
        public virtual DbSet<VcDriver> VcDrivers { get; set; }
        public virtual DbSet<VcSOSInfo> VcSOSInfos { get; set; }
        public virtual DbSet<VcSOSMedia> VcSOSMedias { get; set; }
        public virtual DbSet<VcFcm> VcFcms { get; set; }
        public virtual DbSet<VcFcmMessage> VcFcmMessages { get; set; }
        public virtual DbSet<VcAppAccessLog> VcAppAccessLogs { get; set; }
        public virtual DbSet<VcGisTable> VcGisTables { get; set; }
        public virtual DbSet<VcCustomerCareLastMonth> VcCustomerCareLastMonths { get; set; }
        public virtual DbSet<SalesOrdersBackup> SalesOrdersBackups { get; set; }
        public virtual DbSet<LogisticTracking> LogisticTrackings { get; set; }

        //Tin nội bộ Vicem
        public virtual DbSet<VCJnanaFile> VCJnanaFiles { get; set; }
        public virtual DbSet<VCJnanaNewsArticle> VCJnanaNewsArticles { get; set; }
        public virtual DbSet<VCJnanaNewsArticleFile> VCJnanaNewsArticleFiles { get; set; }
        public virtual DbSet<VCJnanaNewsCat> VCJnanaNewsCats { get; set; }
        public virtual DbSet<VCJnanaFcm> VCJnanaFcms { get; set; }
        public virtual DbSet<VCJnanaFcmMessage> VCJnanaFcmMessages { get; set; }


        /// <summary>
        /// Facco
        /// </summary>
        public virtual DbSet<FacoProductCat> FacoProductCats { get; set; }
        public virtual DbSet<OperationOnlineSupport> OperationOnlineSupports { get; set; }
        public virtual DbSet<OperationOnlineSupportTracking> OperationOnlineSupportTrackings { get; set; }
        public virtual DbSet<SetCompanyMenu> SetCompanyMenus { get; set; }

        //public object Remooc_Fcm_Tokens { get; set; }
        public virtual DbSet<ProdPackageReceived> ProdPackageReceiveds { get; set; }
        public virtual DbSet<ProdPackageDelivery> ProdPackageDeliverys { get; set; }

        /// <summary>
        /// Romooc
        /// </summary>
        public virtual DbSet<RmSOSInfo> RmSOSInfos { get; set; }
        public virtual DbSet<RmGisTable> RmGisTables { get; set; }
        public virtual DbSet<RmSOSMedia> RmSOSMedias { get; set; }
        public virtual DbSet<RmJnanaFile> RmJnanaFiles { get; set; }
        public virtual DbSet<RmJnanaNewsArticle> RmJnanaNewsArticles { get; set; }
        public virtual DbSet<RmJnanaNewsArticleFile> RmJnanaNewsArticleFiles { get; set; }
        public virtual DbSet<RmJnanaNewsCat> RmJnanaNewsCats { get; set; }
        public virtual DbSet<RmJnanaFcm> RmJnanaFcms { get; set; }
        public virtual DbSet<RmJnanaFcmMessage> RmJnanaFcmMessages { get; set; }
        public virtual DbSet<RmRemoocCurrentPosition> RmRemoocCurrentPositions { get; set; }
        public virtual DbSet<RmRomoocExtrafield> RmRomoocExtrafields { get; set; }
        public virtual DbSet<RmRemoocPacking> RmRemoocPackings { get; set; }
        public virtual DbSet<RmRemoocRemooc> RmRemoocRemoocs { get; set; }
        public virtual DbSet<RmRemoocTracking> RmRemoocTrackings { get; set; }
        public virtual DbSet<RmRemoocTractor> RmRemoocTractors { get; set; }
        public virtual DbSet<RmRemoocFcm> RmRemoocFcms { get; set; }
        public virtual DbSet<RmRomoocDriver> RmRomoocDrivers { get; set; }
        public virtual DbSet<RmRemoocFcmMesage> RmRemoocFcmMesages { get; set; }
        public virtual DbSet<RmCommandOrderTruck> RmCommandOrderTrucks { get; set; }
        public virtual DbSet<RmECompany> RmECompanys { get; set; }
        public virtual DbSet<RmVayxeCatSevices> RmVayxeCatSevicess { get; set; }
        public virtual DbSet<RmVayxeTableCostHeader> RmVayxeTableCostHeaders { get; set; }
        public virtual DbSet<RmVayxeTableCostDetails> RmVayxeTableCostDetailss { get; set; }
        public virtual DbSet<RmVayxeBookChecking> RmVayxeBookCheckings { get; set; }
        public virtual DbSet<RmVayxeBookServiceDetails> RmVayxeBookServiceDetailss { get; set; }
        public virtual DbSet<RmVayxeBookMaterialDetails> RmVayxeBookMaterialDetailss { get; set; }
        public virtual DbSet<RmVayxeVendor> RmVayxeVendors { get; set; }
        public virtual DbSet<RmVayxeMaterialGoods> RmVayxeMaterialGoodss { get; set; }
        public virtual DbSet<RmJnanaApiGoogleServices> RmJnanaApiGoogleServicess { get; set; }
        public virtual DbSet<RmJnanaCountRequestGoogle> RmJnanaCountRequestGoogles { get; set; }
        public virtual DbSet<RmDriverActivityLog> RmDriverActivityLogs { get; set; }
        public virtual DbSet<RmHrEmployee> RmHrEmployees { get; set; }
        public virtual DbSet<RmCancelTracking> RmCancelTrackings { get; set; }
        public virtual DbSet<RmCommentSetting> RmCommentSettings { get; set; }

        public virtual DbSet<IconManager> IconManagers { get; set; }
        public virtual DbSet<SubProduct> SubProducts { get; set; }
        public virtual DbSet<ProductLotFile> ProductLotFiles { get; set; }

        public virtual DbSet<LotProduct> LotProducts { get; set; }
        public virtual DbSet<LotProductDetail> LotProductDetails { get; set; }
        public virtual DbSet<PoBuyerHeader> PoBuyerHeaders { get; set; }
        public virtual DbSet<PoBuyerHeaderNotDone> PoBuyerHeaderNotDones { get; set; }
        public virtual DbSet<PoBuyerHeaderPayment> PoBuyerHeaderPayments { get; set; }
        public virtual DbSet<PoBuyerDetail> PoBuyerDetails { get; set; }
        public virtual DbSet<PoSupUpdateTracking> PoSupUpdateTrackings { get; set; }
        public virtual DbSet<PoCusUpdateTracking> PoCusUpdateTrackings { get; set; }

        ///<summary>
        ///FUND
        ///</sumary>
        public virtual DbSet<FundAccEntry> FundAccEntrys { get; set; }
        public virtual DbSet<ParamForWarning> ParamForWarnings { get; set; }
        public virtual DbSet<FundExchagRate> FundExchagRates { get; set; }
        public virtual DbSet<FundCurrency> FundCurrencys { get; set; }
        public virtual DbSet<FundCatReptExps> FundCatReptExpss { get; set; }
        public virtual DbSet<FundFiles> FundFiless { get; set; }
        public virtual DbSet<FundAccEntryTracking> FundAccEntryTrackings { get; set; }
        public virtual DbSet<ProductCostDetail> ProductCostDetails { get; set; }
        public virtual DbSet<CostTableLog> CostTableLogs { get; set; }
        public virtual DbSet<ProductCostHeader> ProductCostHeaders { get; set; }
        public virtual DbSet<ProductQrCode> ProductQrCodes { get; set; }
        public virtual DbSet<FundRelativeObjMng> FundRelativeObjMngs { get; set; }
        public virtual DbSet<FundLoaddingSMSBank> FundLoaddingSMSBanks { get; set; }



        /// IOT_Table
        public virtual DbSet<IotCarInOut> IotCarInOuts { get; set; }
        public virtual DbSet<IotWarningSetting> IotWarningSettings { get; set; }
        public virtual DbSet<IotAnalysis_Action> IotAnalysis_Actions { get; set; }
        public virtual DbSet<IotSensor> IotSensors { get; set; }
        public virtual DbSet<IotSetUpAlert> IotSetUpAlerts { get; set; }
        public virtual DbSet<IotDeviceInfo> IotDeviceInfos { get; set; }
        public virtual DbSet<ZoneSetup> ZoneSetups { get; set; }
        public virtual DbSet<ZoneDevicePlacement> ZoneDevicePlacements { get; set; }

        ///Phần Share File
        public virtual DbSet<EDMSObjectShareFile> EDMSObjectShareFiles { get; set; }

        ///Phần Dịch Vụ
        ///
        public virtual DbSet<ServiceCategoryAttribute> ServiceCategoryAttributes { get; set; }
        public virtual DbSet<ServiceCategoryGroup> ServiceCategoryGroups { get; set; }
        public virtual DbSet<ServiceCategoryType> ServiceCategoryTypes { get; set; }
        public virtual DbSet<ServiceCategoryCostCondition> ServiceCategoryCostConditions { get; set; }
        public virtual DbSet<ServiceCategoryCostHeader> ServiceCategoryCostHeaders { get; set; }

        //Syncfusion
        public virtual DbSet<AseanDocument> AseanDocuments { get; set; }
        public virtual DbSet<LogChangeDocument> LogChangeDocuments { get; set; }

        /// <summary>
        /// Work Flow
        /// </summary>
        public virtual DbSet<WfObject> WfObjects { get; set; }
        public virtual DbSet<WorkFlow> WorkFlows { get; set; }
        public virtual DbSet<WorkFlowRule> WorkFlowRules { get; set; }
        public virtual DbSet<ProgressTracking> ProgressTrackings { get; set; }
        /// <summary>
        /// Zoom Meeting
        /// </summary>
        public virtual DbSet<ZoomManage> ZoomManages { get; set; }
        public virtual DbSet<ZoomReportError> ZoomReportErrors { get; set; }

        /// <summary>
        /// Salary table
        /// </summary>
        public virtual DbSet<SalaryTableHeader> SalaryTableHeaders { get; set; }
        public virtual DbSet<SalaryTableDetail> SalaryTableDetails { get; set; }
        public virtual DbSet<SalaryTableAllowance> SalaryTableAllowances { get; set; }
        public virtual DbSet<SalaryEmployeeMonth> SalaryEmployeeMonths { get; set; }

        /// <summary>
        /// Danh sách đối tượng
        /// </summary>
        /// 
        public virtual DbSet<VAllObject> VAllObjects { get; set; }
        public virtual DbSet<VAmchartCountBuy> VAmchartCountBuys { get; set; }
        public virtual DbSet<VAmchartCountSale> VAmchartCountSales { get; set; }
        public virtual DbSet<VAmchartCountCustomer> VAmchartCountCustomers { get; set; }
        public virtual DbSet<VAmchartCountSupplier> VAmchartCountSuppliers { get; set; }
        public virtual DbSet<VAmchartCountProject> VAmchartCountProjects { get; set; }
        public virtual DbSet<VAmchartCountEmployee> VAmchartCountEmployees { get; set; }
        public virtual DbSet<VHighchartFund> VHighchartFunds { get; set; }
        public virtual DbSet<VHighchartProd> VHighchartProds { get; set; }
        public virtual DbSet<VListBoard> VListBoards { get; set; }
        public virtual DbSet<VCardProcess> VCardProcesss { get; set; }

        /// <summary>
        /// Log message
        /// </summary>
        /// 
        public virtual DbSet<LogMessage> LogMessages { get; set; }


        /// <summary>
        /// Urenco
        /// </summary>
        /// 
        public virtual DbSet<UrencoCarMaintenanceHeader> UrencoCarMaintenanceHeaders { get; set; }
        public virtual DbSet<UrencoCarCostHeader> UrencoCarCostHeaders { get; set; }
        public virtual DbSet<UrencoCarCostDetail> UrencoCarCostDetails { get; set; }
        public virtual DbSet<UrencoCarManager> UrencoCarManagers { get; set; }

        /// <summary>
        /// Excel Expression
        /// </summary>
        /// 
        public virtual DbSet<ExcelExpression> ExcelExpressions { get; set; }

        /// <summary>
        /// Allowance
        /// </summary>
        /// 
        public virtual DbSet<AllowanceCategory> AllowanceCategorys { get; set; }
        public virtual DbSet<AllowanceParam> AllowanceParams { get; set; }
        public virtual DbSet<AllowanceContraint> AllowanceContraints { get; set; }
        public virtual DbSet<AllowanceEmployeeAccept> AllowanceEmployeeAccepts { get; set; }
        public virtual DbSet<AllowanceEmployeeParam> AllowanceEmployeeParams { get; set; }
        public virtual DbSet<AllowanceEmployeeMonth> AllowanceEmployeeMonths { get; set; }

        /// <summary>
        /// DashBoard
        /// </summary>
        /// 
        public virtual DbSet<DashboardDataJson> DashboardDataJsons { get; set; }

        /// <summary>
        /// A365
        /// </summary>
        /// 
        public virtual DbSet<UserA365> UserA365s { get; set; }
        /// <summary>
        /// phan luon QuangHanh
        /// </summary>
        /// 
        public virtual DbSet<PaySheet> PaySheets { get; set; }
        public virtual DbSet<CameraRoom> CameraRooms { get; set; }
        #region Urenco
        public virtual DbSet<UrencoRoute> UrencoRoutes { get; set; }
        public virtual DbSet<UrencoTrashCar> UrencoTrashCars { get; set; }
        public virtual DbSet<UrencoNode> UrencoNodes { get; set; }
        public virtual DbSet<UrencoRubbishBin> UrencoRubbishBins { get; set; }
        public virtual DbSet<UrencoDriverMapping> UrencoDriverMappings { get; set; }
        public virtual DbSet<UrencoNodesRubbishMapping> UrencoNodesRubbishMapping { get; set; }
        public virtual DbSet<UrencoAssetsCategory> UrencoAssetsCategorys { get; set; }
        public virtual DbSet<UrencoMaterialProductGroup> UrencoMaterialProductGroup { get; set; }
        public virtual DbSet<UrencoArea> UrencoAreas { get; set; }
        public virtual DbSet<UrencoAreaRoute> UrencoAreaRoutes { get; set; }
        public virtual DbSet<UrencoAreaTeam> UrencoAreaTeams { get; set; }
        public virtual DbSet<UrencoCatActivity> UrencoCatActivitys { get; set; }
        public virtual DbSet<UrencoCatObjectType> UrencoCatObjectTypes { get; set; }
        public virtual DbSet<UrencoCatObjectActivity> UrencoCatObjectActivitys { get; set; }
        public virtual DbSet<UrencoDataWorking> UrencoDataWorkings { get; set; }
        public virtual DbSet<UrencoActivityCar> UrencoActivityCars { get; set; }
        public virtual DbSet<UrencoObjectImpact> UrencoObjectImpacts { get; set; }
        public virtual DbSet<UrencoObjectWorkspace> UrencoObjectWorkspaces { get; set; }
        public virtual DbSet<UrencoStreetworkerReport> UrencoStreetworkerReports { get; set; }
        public virtual DbSet<CommandTracking> CommandTrackings { get; set; }

        public virtual DbSet<UrencoTableVariable> UrencoTableVariables { get; set; }
        public virtual DbSet<UrencoBranchWorking> UrencoBranchWorkings { get; set; }
        public class UrencoTableVariable
        {
            [Key]
            public Guid Id { get; set; }
            public string Code { get; set; }
            public string Name { get; set; }
        }
        public virtual DbSet<Test> Tests { get; set; }
        public class Test
        {
            [Key]
            public Guid Id { get; set; }
            public string Code { get; set; }
            public string Name { get; set; }
        }
        #endregion

        #region OTP
        public virtual DbSet<OTPManager> OTPManagers { get; set; }
        #endregion

        /// <summary>
        /// OCR
        /// </summary>
        /// 
        public virtual DbSet<ResultFindOCR> ResultFindOCRs { get; set; }
        public virtual DbSet<KeyWordDataPool> KeyWordDataPools { get; set; }
        public virtual DbSet<UsrKeyWordSetup> UsrKeyWordSetups { get; set; }

        /// <summary>
        /// Temp key word search
        /// </summary>
        ///
        public virtual DbSet<TempKeyWordSearch> TempKeyWordSearchs { get; set; }

        /// <summary>
        /// Meeting Schedule
        /// </summary>
        ///
        public virtual DbSet<MeetingSchedule> MeetingSchedules { get; set; }


        /// <summary>
        /// Records pack
        /// </summary>
        ///
        public virtual DbSet<RecordsPack> RecordsPacks { get; set; }
        public virtual DbSet<RecordsPackAttr> RecordsPackAttrs { get; set; }
        public virtual DbSet<RecordPackArrangeLog> RecordPackArrangeLogs { get; set; }
        public virtual DbSet<RecordsPackFile> RecordsPackFiles { get; set; }

        /// <summary>
        /// Zone Manager
        /// </summary>
        ///
        public virtual DbSet<ZoneStruct> ZoneStructs { get; set; }
        public virtual DbSet<ZoneAttr> ZoneAttrs { get; set; }
        /// <summary>
        /// New Zone Manager
        /// </summary>
        ///
        public virtual DbSet<PAreaCategory> PAreaCategories { get; set; }
        public virtual DbSet<PAreaMapping> PAreaMappings { get; set; }
        /// <summary>
        /// New Zone Manager Store
        /// </summary>
        ///
        public virtual DbSet<PAreaCategoryStore> PAreaCategoriesStore { get; set; }
        public virtual DbSet<PAreaMappingStore> PAreaMappingsStore { get; set; }
        /// <summary>
        /// RECODE DELIVERRY
        /// </summary>
        ///
        public virtual DbSet<RecordDeliveryHeader> RecordDeliveryHeaders { get; set; }
        public virtual DbSet<RecordDeliveryDetail> RecordDeliveryDetails { get; set; }
        public virtual DbSet<AssetRecordDeliveryHeader> AssetRecordDeliveryHeaders { get; set; }
        public virtual DbSet<AssetRecordDeliveryDetail> AssetRecordDeliveryDetails { get; set; }
        /// <summary>
        /// Asset Zone Manager
        /// </summary>
        ///
        public virtual DbSet<AssetZoneAttr> AssetZoneAttrs { get; set; }
        public virtual DbSet<AssetZoneStruct> AssetZoneStructs { get; set; }
        public virtual DbSet<AssetZoneMapping> AssetZoneMappings { get; set; }
        public virtual DbSet<AssetRecordsPack> AssetRecordsPacks { get; set; }
        public virtual DbSet<AssetRecordsPackAttr> AssetRecordsPackAttrs { get; set; }
        public virtual DbSet<AssetRecordsPackFile> AssetRecordsPackFiles { get; set; }

        /// <summary>
        /// Warehouse Zone Manager
        /// </summary>
        ///
        public virtual DbSet<WarehouseZoneAttr> WarehouseZoneAttrs { get; set; }
        public virtual DbSet<WarehouseZoneStruct> WarehouseZoneStructs { get; set; }
        public virtual DbSet<WarehouseZoneMapping> WarehouseZoneMappings { get; set; }
        public virtual DbSet<WarehouseRecordsPack> WarehouseRecordsPacks { get; set; }
        public virtual DbSet<WarehouseRecordsPackAttr> WarehouseRecordsPackAttrs { get; set; }
        public virtual DbSet<WarehouseRecordsPackFile> WarehouseRecordsPackFiles { get; set; }
        /// <summary>
        /// App meeting
        /// </summary>
        ///
        public virtual DbSet<AppMeeting> AppMeetings { get; set; }
        public virtual DbSet<DeviceMeetingControl> DeviceMeetingControls { get; set; }

        /// <summary>
        /// Chat
        /// </summary>
        ///
        public virtual DbSet<ChatGroup> ChatGroups { get; set; }
        public virtual DbSet<ChatHistory> ChatHistorys { get; set; }

        /// <summary>
        /// WeekWorkingScheduler
        /// </summary>
        ///
        public virtual DbSet<WeekWorkingScheduler> WeekWorkingSchedulers { get; set; }
        public virtual DbSet<WorkingSchedule> WorkingSchedules { get; set; }
        public virtual DbSet<WorkScheduleComment> WorkScheduleComments { get; set; }
        public virtual DbSet<RecruitmentScheduler> RecruitmentSchedulers { get; set; }

        /// <summary>
        /// Edu
        /// </summary>
        ///
        public virtual DbSet<EduCategory> EduCategorys { get; set; }
        public virtual DbSet<EduLecture> EduLectures { get; set; }
        public virtual DbSet<CommonSettingCategory> CommonSettingCategories { get; set; }
        public virtual DbSet<EduExtraFieldGroup> EduExtraFieldGroups { get; set; }
        public virtual DbSet<QuizPool> QuizPools { get; set; }
        public virtual DbSet<EduExamination> EduExaminations { get; set; }
        public virtual DbSet<EduExaminationDetail> EduExaminationDetails { get; set; }
        public virtual DbSet<UserExerciseResultSession> UserExerciseResultSessions { get; set; }
        public virtual DbSet<UserExerciseResultDetail> UserExerciseResultDetails { get; set; }
        public virtual DbSet<UserExaminationResultSession> UserExaminationResultSessions { get; set; }
        public virtual DbSet<UserExaminationResultDetail> UserExaminationResultDetails { get; set; }
        public virtual DbSet<EmployeeCoaching> EmployeeCoachings { get; set; }
        public virtual DbSet<LectureDiscuss> LectureDiscusss { get; set; }

        /// <summary>
        /// Commitment
        /// </summary>
        ///
        public virtual DbSet<CommitmentHeader> CommitmentHeaders { get; set; }
        public virtual DbSet<CommitmentDetail> CommitmentDetails { get; set; }
        public virtual DbSet<CompanyRuleItem> CompanyRuleItems { get; set; }
        //Buffalo W
        public virtual DbSet<BwBotInstantDatamining> BwBotInstantDataminings { get; set; }
        public virtual DbSet<BwWebrtcChannelControl> BwWebrtcChannelControls { get; set; }
        public virtual DbSet<BwWebsyncServerChannel> BwWebsyncServerChannels { get; set; }

        //Crawler 
        public virtual DbSet<CrawlerSessionContentResult> CrawlerSessionContentResults { get; set; }
        /// <summary>
        /// Backup
        /// 
        /// 
        /// </summary>
        ///
        public virtual DbSet<VTableName> VTableNames { get; set; }
        // Payment
        
        public virtual DbSet<WalletPackage> WalletPackages { get; set; }
        public virtual DbSet<WalletTableCostItem> WalletTableCostItems { get; set; }
        public virtual DbSet<WalletCoinTransaction> WalletCoinTransactions { get; set; }
        public virtual DbSet<ItemPackUser> ItemPackUsers { get; set; }
        public virtual DbSet<LmsWithdrawn> LmsWithdrawals { get; set; }
        public virtual DbSet<WalletDepositTransaction> WalletDepositTransactions { get; set; }
        public virtual DbSet<PaymentGateway> PaymentGateways { get; set; }
        public virtual DbSet<CoinRateExchange> CoinRateExchanges { get; set; }

        public virtual DbSet<ProductQualityInspectionAttr> ProductQualityInspectionAttrs { get; set; }
        public virtual DbSet<InvoiceCustomerGate> InvoiceCustomerGates { get; set; }


        /// <param name="modelBuilder"></param>
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            #region Builder entity

            modelBuilder.Entity<AspNetRole>(entity =>
            {
                entity.Property(e => e.Id).HasMaxLength(50).HasColumnName("RoleId");
                entity.Property(e => e.ConcurrencyStamp).HasMaxLength(255);
                entity.Property(e => e.Name).HasMaxLength(255);
                entity.Property(e => e.NormalizedName).HasMaxLength(255);

                entity.HasIndex(e => e.NormalizedName).HasName("IX_ROLES_NAME").IsUnique();
            });

            modelBuilder.Entity<AspNetUser>(entity =>
            {

                entity.Property(e => e.Id).HasMaxLength(50).HasColumnName("UserId");
                entity.Property(e => e.ConcurrencyStamp).HasMaxLength(50);
                entity.Property(e => e.PasswordHash).HasMaxLength(2000);
                entity.Property(e => e.SecurityStamp).HasMaxLength(50);
                entity.Property(e => e.PhoneNumber).HasMaxLength(100);

                entity.Property(e => e.Email).HasMaxLength(256);
                entity.Property(e => e.NormalizedEmail).HasMaxLength(256);

                entity.Property(e => e.UserName).IsRequired().HasMaxLength(256);
                entity.Property(e => e.NormalizedUserName).IsRequired().HasMaxLength(256);

                entity.HasIndex(e => e.NormalizedEmail).HasName("IX_USERS_EMAIL");
                entity.HasIndex(e => e.NormalizedUserName).HasName("IX_USERS_USER_NAME").IsUnique();

            });

            modelBuilder.Entity<AdApplication>(entity =>
            {

            });

            modelBuilder.Entity<AdFunction>(entity =>
            {

            });

            modelBuilder.Entity<AdAppFunction>(entity =>
            {

            });
            modelBuilder.Entity<MobileAppFunction>(entity =>
            {

            });

            modelBuilder.Entity<AdGroupUser>(entity =>
            {

            });

            modelBuilder.Entity<AdOrganization>(entity =>
            {

            });

            modelBuilder.Entity<AdParameter>(entity =>
            {

            });

            modelBuilder.Entity<AdPermission>(entity =>
            {

            });

            modelBuilder.Entity<AdPrivilege>(entity =>
            {

            });

            modelBuilder.Entity<AdResource>(entity =>
            {

            });

            modelBuilder.Entity<AdUserInGroup>(entity =>
            {

            });
            // Production relationship
            modelBuilder.Entity<ProductImportDetail>().HasMany(u => u.ProductInStocks).WithOne(u => u.Detail)
                .HasForeignKey(c => c.IdImpProduct).IsRequired(false)
                .OnDelete(DeleteBehavior.ClientSetNull);
            modelBuilder.Entity<ProductImportDetail>().HasMany(u => u.BottleInStocks).WithOne()
                .HasForeignKey(c => c.ParentId).IsRequired(false)
                .OnDelete(DeleteBehavior.ClientSetNull);
            modelBuilder.Entity<ProductImportDetail>().HasMany(u => u.BottleDetails).WithOne()
                .HasForeignKey(c => c.ParentId).IsRequired(false)
                .OnDelete(DeleteBehavior.ClientSetNull);
            modelBuilder.Entity<ProductImportDetail>().HasOne(u => u.Product).WithMany()
                .HasForeignKey(e => new { e.ProductCode, e.DeletionToken })
                .HasPrincipalKey(x => new { x.ProductCode, x.DeletionToken })
                .IsRequired(false).OnDelete(DeleteBehavior.ClientSetNull);
            modelBuilder.Entity<ProductInStock>().HasOne(u => u.Product).WithMany()
                .HasForeignKey(e => new { e.ProductCode, e.DeletionToken })
                .HasPrincipalKey(x => new { x.ProductCode, x.DeletionToken })
                .IsRequired(false).OnDelete(DeleteBehavior.ClientSetNull);
            modelBuilder.Entity<ProductLocatedMapping>().HasOne(u => u.Product).WithMany()
                .HasForeignKey(e => new { e.ProductCode, e.DeletionToken })
                .HasPrincipalKey(x => new { x.ProductCode, x.DeletionToken })
                .IsRequired(false).OnDelete(DeleteBehavior.ClientSetNull);
            modelBuilder.Entity<MaterialProduct>().HasOne(u => u.Group).WithMany()
                .HasForeignKey(e => new { e.GroupCode })
                .HasPrincipalKey(x => new { x.Code })
                .IsRequired(false).OnDelete(DeleteBehavior.ClientSetNull);
            //modelBuilder.HasDbFunction(typeof(EIMDBContext).GetMethod(nameof(QuizLatexSearch), new[] { typeof(string), typeof(string) }) ?? throw new InvalidOperationException())
            //    .HasName("F_QUIZ_LATEX_SEARCH");
            #endregion

            base.OnModelCreating(modelBuilder);

            #region Replace all table, column name to snake case
            foreach (var entity in modelBuilder.Model.GetEntityTypes())
            {
                // Replace table names
                entity.Relational().TableName = entity.Relational().TableName.ToSnakeCase(true);

                // Replace column names            
                foreach (var property in entity.GetProperties())
                {
                    if (string.IsNullOrEmpty(property.Relational().ColumnName) || !property.Name.StartsWith("PArea"))
                    {
                        property.Relational().ColumnName = property.Name.ToSnakeCase(true); 
                    }
                    if (property.Name.StartsWith("PArea"))
                    {
                        Console.Write(property.Name);
                    }
                }

                foreach (var key in entity.GetKeys())
                {
                    key.Relational().Name = key.Relational().Name.ToSnakeCase(true);
                }

                foreach (var key in entity.GetForeignKeys())
                {
                    key.Relational().Name = key.Relational().Name.ToSnakeCase(true);
                }

                foreach (var index in entity.GetIndexes())
                {
                    index.Relational().Name = index.Relational().Name.ToSnakeCase(true);
                }
            }
            #endregion
        }

    }
}