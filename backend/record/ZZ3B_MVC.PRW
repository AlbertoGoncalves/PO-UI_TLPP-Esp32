#INCLUDE 'TOTVS.CH'
#INCLUDE 'FWMVCDEF.CH'

//-------------------------------------------------------------------
/*/{Protheus.doc} ZZ3B_MVC
Exemplo de montagem da modelo e interface para um tabela em MVC

@author Ernani Forastieri e Rodrigo Antonio Godinho
@since 05/10/2009
@version P10
/*/
//-------------------------------------------------------------------
User Function ZZ3B_MVC()
Local oBrowse
// Local sCampoOptions := "ZZ3_TIPO"
// Local sTab := "ZZ3"

oBrowse := FWMBrowse():New()
oBrowse:SetAlias('ZZ3')
oBrowse:SetDescription('Browse Cadastro ZZ3')
// oBrowse:AddLegend( "ZZ3_TIPO=='1'", "YELLOW", "TIPO 1")
// oBrowse:AddLegend( "ZZ3_TIPO=='2'", "BLUE"  , "TIPO 2" )
// oBrowse:AddLegend( "ZZ3_TIPO=='3'", "RED"  , "TIPO 3" )

// aSetFilter :=  U_DialogZZ3_1(sTab,sCampoOptions)
// If aSetFilter[2]
// 	oBrowse:SetFilterDefault(sCampoOptions + " $ '"+aSetFilter[1]+"'")
// EndIf

//oBrowse:SetFilterDefault( "Empty(ZZ3_DTAFAL)" )
//oBrowse:DisableDetails()
//oBrowse:SetCacheView( .F. )
oBrowse:Activate()

Return NIL

//-------------------------------------------------------------------
Static Function MenuDef()
Local aRotina := {}

ADD OPTION aRotina TITLE 'Visualizar' ACTION 'VIEWDEF.ZZ3B_MVC' OPERATION 2 ACCESS 0
ADD OPTION aRotina TITLE 'Incluir'    ACTION 'VIEWDEF.ZZ3B_MVC' OPERATION 3 ACCESS 0
ADD OPTION aRotina TITLE 'Alterar'    ACTION 'VIEWDEF.ZZ3B_MVC' OPERATION 4 ACCESS 0
ADD OPTION aRotina TITLE 'Excluir'    ACTION 'VIEWDEF.ZZ3B_MVC' OPERATION 5 ACCESS 0
ADD OPTION aRotina TITLE 'Imprimir'   ACTION 'VIEWDEF.ZZ3B_MVC' OPERATION 8 ACCESS 0
ADD OPTION aRotina TITLE 'Copiar'     ACTION 'VIEWDEF.ZZ3B_MVC' OPERATION 9 ACCESS 0
Return aRotina


//-------------------------------------------------------------------
Static Function ModelDef()
// Cria a estrutura a ser usada no Modelo de Dados
Local oStruZZ3 := FWFormStruct( 1, 'ZZ3', /*bAvalCampo*/,/*lViewUsado*/ )
Local oModel

// Remove campos da estrutura
//oStruZZ3:RemoveField( 'ZZ3_QTDMUS' )

//Campos Memo Virtuais SYP
//FWMemoVirtual( oStruZA1, {{'ZZ3_CDSYP1','ZZ3_MMSYP1'},{'ZZ3_CDSYP2','ZZ3_MMSYP2'}}  )

// Altero propriedades dos campos da estrutura, no caso colocando cada campo no seu grupo
//
// SetProperty( <Campo>, <Propriedade>, <Valor> )
//
// Propriedades existentes para View (lembre-se de incluir o FWMVCDEF.CH):
//
//	MODEL_FIELD_TITULO
//	MODEL_FIELD_TOOLTIP
//	MODEL_FIELD_IDFIELD
//	MODEL_FIELD_TIPO
//	MODEL_FIELD_TAMANHO
//	MODEL_FIELD_DECIMAL
//	MODEL_FIELD_VALID
//	MODEL_FIELD_WHEN
//	MODEL_FIELD_VALUES
//	MODEL_FIELD_OBRIGAT
//	MODEL_FIELD_INIT
//	MODEL_FIELD_KEY
//	MODEL_FIELD_NOUPD
//	MODEL_FIELD_VIRTUAL
//
//oStruZZ3:SetProperty( '*'         , MODEL_FIELD_NOUPD, .T. )

// Cria o objeto do Modelo de Dados
oModel := MPFormModel():New('ZZ3M', /*bPreValidacao*/, /*bPosValidacao*/, /*bCommit*/, /*bCancel*/ )
//oModel := MPFormModel():New('ZZ3MODEL', /*bPreValidacao*/, { |oMdl| ZZ3BPOS( oMdl ) }, /*bCommit*/, /*bCancel*/ )

// Adiciona ao modelo uma estrutura de formulário de edição por campo
oModel:AddFields( 'ZZ3MASTER', /*cOwner*/, oStruZZ3, /*bPreValidacao*/, /*bPosValidacao*/, /*bCarga*/ )

// Adiciona a descricao do Modelo de Dados
oModel:SetDescription( 'Modelo de Dados Cadastro ZZ3' )

// Adiciona a descricao do Componente do Modelo de Dados
oModel:GetModel( 'ZZ3MASTER' ):SetDescription( 'Dados Cadastro ZZ3' )

// Liga a validação da ativacao do Modelo de Dados
// oModel:SetVldActivate( { |oModel| BrowseZZ31ACT( oModel ) } )

Return oModel


//-------------------------------------------------------------------
Static Function ViewDef()
// Cria um objeto de Modelo de Dados baseado no ModelDef do fonte informado
Local oModel   := FWLoadModel( 'ZZ3B_MVC' )
// Cria a estrutura a ser usada na View
Local oStruZZ3 := FWFormStruct( 2, 'ZZ3' )
//Local oStruZZ3 := FWFormStruct( 2, 'ZZ3', { |cCampo| ZZ3STRU(cCampo) } )
Local oView
Local cCampos := {}

// Crio os Agrupamentos de Campos
// AddGroup( cID, cTitulo, cIDFolder, nType )   nType => ( 1=Janela; 2=Separador )
//oStruZZ3:AddGroup( 'GRUPO01', 'Alguns Dados', '', 1 )
//oStruZZ3:AddGroup( 'GRUPO02', 'Outros Dados', '', 2 )

// Altero propriedades dos campos da estrutura, no caso colocando cada campo no seu grupo
//
// SetProperty( <Campo>, <Propriedade>, <Valor> )
//
// Propriedades existentes para View (lembre-se de incluir o FWMVCDEF.CH):
//			MVC_VIEW_IDFIELD
//			MVC_VIEW_ORDEM
//			MVC_VIEW_TITULO
//			MVC_VIEW_DESCR
//			MVC_VIEW_HELP
//			MVC_VIEW_PICT
//			MVC_VIEW_PVAR
//			MVC_VIEW_LOOKUP
//			MVC_VIEW_CANCHANGE
//			MVC_VIEW_FOLDER_NUMBER
//			MVC_VIEW_GROUP_NUMBER
//			MVC_VIEW_COMBOBOX
//			MVC_VIEW_MAXTAMCMB
//			MVC_VIEW_INIBROW
//			MVC_VIEW_VIRTUAL
//			MVC_VIEW_PICTVAR
//
//oStruZZ3:SetProperty( '*'         , MVC_VIEW_GROUP_NUMBER, 'GRUPO01' )
//oStruZZ3:SetProperty( 'ZZ3_QTDMUS', MVC_VIEW_GROUP_NUMBER, 'GRUPO02' )
//oStruZZ3:SetProperty( 'ZZ3_TIPO'  , MVC_VIEW_GROUP_NUMBER, 'GRUPO02' )

// Cria o objeto de View
oView := FWFormView():New()

// Define qual o Modelo de dados será utilizado
oView:SetModel( oModel )

//Adiciona no nosso View um controle do tipo FormFields(antiga enchoice)
oView:AddField( 'VIEW_ZZ3', oStruZZ3, 'ZZ3MASTER' )

// Criar um "box" horizontal para receber algum elemento da view
oView:CreateHorizontalBox( 'TELA' , 100 )

// Relaciona o ID da View com o "box" para exibicao
oView:SetOwnerView( 'VIEW_ZZ3', 'TELA' )

//oView:SetViewAction( 'BUTTONOK'    , { |o| Help(,,'HELP',,'Ação de Confirmar ' + o:ClassName(),1,0) } )
//oView:SetViewAction( 'BUTTONCANCEL', { |o| Help(,,'HELP',,'Ação de Cancelar '  + o:ClassName(),1,0) } )
Return oView


//-------------------------------------------------------------------
Static Function ZZ3BPOS( oModel )
Local nOperation := oModel:GetOperation()
Local lRet       := .T.

If nOperation == MODEL_OPERATION_UPDATE
	If Empty( oModel:GetValue( 'ZZ3MASTER', 'ZZ3_RECORD' ) )
		Help( ,, 'HELP',, 'Informe a data', 1, 0)
		lRet := .F.
	EndIf
EndIf

Return lRet

//-------------------------------------------------------------------
Static Function ZZ3ACT( oModel )  // Passa o model sem dados
Local aArea      := GetArea()
Local cQuery     := ''
Local cTmp       := ''
Local lRet       := .T.
Local nOperation := oModel:GetOperation()

If nOperation == MODEL_OPERATION_DELETE .AND. lRet

	cTmp    := GetNextAlias()

	cQuery  := "SELECT ZZ3_CODE FROM " + RetSqlName( 'ZZ3' ) + " ZZ3 "
	cQuery  += " WHERE EXISTS ( "
	cQuery  += "       SELECT 1 FROM " + RetSqlName( 'SB1' ) + " SB1 "
	cQuery  += "        WHERE B1_CODIGO = ZZ3_CODE"
	cQuery  += "          AND SB1.D_E_L_E_T_ = ' ' ) "
	cQuery  += "   AND ZZ3_CODE = '" + ZZ3->ZZ3_CODE  + "' "
	cQuery  += "   AND ZZ3.D_E_L_E_T_ = ' ' "

	dbUseArea( .T., "TOPCONN", TcGenQry( ,, cQuery ) , cTmp, .F., .T. )

	lRet := (cTmp)->( EOF() )

	(cTmp)->( dbCloseArea() )

	// If lRet
	// 	cQuery  := "SELECT ZZ3_CODE FROM " + RetSqlName( 'ZZ3' ) + " ZZ3 "
	// 	cQuery  += " WHERE EXISTS ( "
	// 	cQuery  += "       SELECT 1 FROM " + RetSqlName( 'ZA5' ) + " ZA5 "
	// 	cQuery  += "        WHERE ZA5_INTER = ZZ3_CODE"
	// 	cQuery  += "          AND ZA5.D_E_L_E_T_ = ' ' ) "
	// 	cQuery  += "   AND ZZ3_CODE = '" + ZZ3->ZZ3_CODE  + "' "
	// 	cQuery  += "   AND ZZ3.D_E_L_E_T_ = ' ' "

	// 	dbUseArea( .T., "TOPCONN", TcGenQry( ,, cQuery ) , cTmp, .F., .T. )

	// 	lRet := (cTmp)->( EOF() )

	// 	(cTmp)->( dbCloseArea() )

	// EndIf

	If !lRet
		Help( ,, 'HELP',, 'Este item do Cadastro 01 nao pode ser excluido.', 1, 0)
	EndIf

EndIf

RestArea( aArea )

Return lRet


//-------------------------------------------------------------------
Static Function ZZ3STRU( cCampo )
Local lRet := .T.

If cCampo == 'ZZ3_CODE'
	lRet := .F.
EndIf

Return lRet
