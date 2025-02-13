// #include 'tlpp-core.th'
#INCLUDE 'FWMVCDEF.CH'
#INCLUDE 'TOTVS.CH'

//-------------------------------------------------------------------
/*/{Protheus.doc} ZZ1B_MVC
Exemplo de montagem da modelo e interface para um tabela em MVC

@author Ernani Forastieri e Rodrigo Antonio Godinho
@since 05/10/2009
@version P10
/*/
//-------------------------------------------------------------------
User Function ZZ1B_MVC()
Local oBrowse

oBrowse := FWMBrowse():New()
oBrowse:SetAlias('ZZ1')
oBrowse:SetDescription('Rastreadores')
oBrowse:AddLegend( "ZZ1_STATUS=='001'", "YELLOW", "001=ALOCADO")
oBrowse:AddLegend( "ZZ1_STATUS=='002'", "BLUE", "002=DISPONIVEL" )
oBrowse:AddLegend( "ZZ1_STATUS=='003'", "RED", "003=EM MANUTENÇÃO" )
oBrowse:AddLegend( "ZZ1_STATUS=='004'", "BLACK", "004=DESCONTINUADO" )

//ROTINA PARA TRATAR FILTRO RAPIDO AO ABRIR BROWSER
// aSetFilter :=  U_DialogZZ1_1('ZZ1',sCampoOptions)
// If aSetFilter[2]
// 	oBrowse:SetFilterDefault(sCampoOptions + " $ '"+aSetFilter[1]+"'")
// EndIf

//oBrowse:SetFilterDefault( "Empty(ZZ1_DTAFAL)" )
//oBrowse:DisableDetails()
//oBrowse:SetCacheView( .F. )
oBrowse:Activate()

Return NIL

//-------------------------------------------------------------------
Static Function MenuDef()
Local aRotina := {}

ADD OPTION aRotina TITLE 'Visualizar' ACTION 'VIEWDEF.ZZ1B_MVC' OPERATION 2 ACCESS 0
ADD OPTION aRotina TITLE 'Incluir'    ACTION 'VIEWDEF.ZZ1B_MVC' OPERATION 3 ACCESS 0
ADD OPTION aRotina TITLE 'Alterar'    ACTION 'VIEWDEF.ZZ1B_MVC' OPERATION 4 ACCESS 0
ADD OPTION aRotina TITLE 'Excluir'    ACTION 'VIEWDEF.ZZ1B_MVC' OPERATION 5 ACCESS 0
ADD OPTION aRotina TITLE 'Imprimir'   ACTION 'VIEWDEF.ZZ1B_MVC' OPERATION 8 ACCESS 0
ADD OPTION aRotina TITLE 'Copiar'     ACTION 'VIEWDEF.ZZ1B_MVC' OPERATION 9 ACCESS 0
Return aRotina


//-------------------------------------------------------------------
Static Function ModelDef()
// Cria a estrutura a ser usada no Modelo de Dados
Local oStruZZ1 := FWFormStruct( 1, 'ZZ1', /*bAvalCampo*/,/*lViewUsado*/ )
Local oModel

// Remove campos da estrutura
//oStruZZ1:RemoveField( 'ZZ1_QTDMUS' )

//Campos Memo Virtuais SYP
//FWMemoVirtual( oStruZA1, {{'ZZ1_CDSYP1','ZZ1_MMSYP1'},{'ZZ1_CDSYP2','ZZ1_MMSYP2'}}  )

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
//oStruZZ1:SetProperty( '*'         , MODEL_FIELD_NOUPD, .T. )

// Cria o objeto do Modelo de Dados
oModel := MPFormModel():New('ZZ1M', /*bPreValcodeacao*/, /*bPosValcodeacao*/, /*bCommit*/, /*bCancel*/ )
//oModel := MPFormModel():New('ZZ1BMODEL', /*bPreValcodeacao*/, { |oMdl| ZZ1BPOS( oMdl ) }, /*bCommit*/, /*bCancel*/ )

// Adiciona ao modelo uma estrutura de formulário de edição por campo
oModel:AddFields( 'ZZ1MASTER', /*cOwner*/, oStruZZ1, /*bPreValcodeacao*/, /*bPosValcodeacao*/, /*bCarga*/ )

// Adiciona a descricao do Modelo de Dados
oModel:SetDescription( 'Modelo de Dados Rastreadores' )

// Adiciona a descricao do Componente do Modelo de Dados
oModel:GetModel( 'ZZ1MASTER' ):SetDescription( 'Dados Rastreadores' )

// Liga a valcodeação da ativacao do Modelo de Dados
// oModel:SetVldActivate( { |oModel| ZZ1BACT( oModel ) } )

Return oModel


//-------------------------------------------------------------------
Static Function ViewDef()
// Cria um objeto de Modelo de Dados baseado no ModelDef do fonte informado
Local oModel   := FWLoadModel( 'ZZ1B_MVC' )
// Cria a estrutura a ser usada na View
Local oStruZZ1 := FWFormStruct( 2, 'ZZ1' )
//Local oStruZZ1 := FWFormStruct( 2, 'ZZ1', { |cCampo| COMP11STRU(cCampo) } )
Local oView
Local cCampos := {}

// Crio os Agrupamentos de Campos
// AddGroup( cID, cTitulo, cIDFolder, nType )   nType => ( 1=Janela; 2=Separador )
//oStruZZ1:AddGroup( 'GRUPO01', 'Alguns Dados', '', 1 )
//oStruZZ1:AddGroup( 'GRUPO02', 'Outros Dados', '', 2 )

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
//oStruZZ1:SetProperty( '*'         , MVC_VIEW_GROUP_NUMBER, 'GRUPO01' )
//oStruZZ1:SetProperty( 'ZZ1_QTDMUS', MVC_VIEW_GROUP_NUMBER, 'GRUPO02' )
//oStruZZ1:SetProperty( 'ZZ1_STATUS'  , MVC_VIEW_GROUP_NUMBER, 'GRUPO02' )

// Cria o objeto de View
oView := FWFormView():New()

// Define qual o Modelo de dados será utilizado
oView:SetModel( oModel )

//Adiciona no nosso View um controle do tipo FormFields(antiga enchoice)
oView:AddField( 'VIEW_ZZ1', oStruZZ1, 'ZZ1MASTER' )

// Criar um "box" horizontal para receber algum elemento da view
oView:CreateHorizontalBox( 'TELA' , 100 )

// Relaciona o ID da View com o "box" para exibicao
oView:SetOwnerView( 'VIEW_ZZ1', 'TELA' )

//oView:SetViewAction( 'BUTTONOK'    , { |o| Help(,,'HELP',,'Ação de Confirmar ' + o:ClassName(),1,0) } )
//oView:SetViewAction( 'BUTTONCANCEL', { |o| Help(,,'HELP',,'Ação de Cancelar '  + o:ClassName(),1,0) } )
Return oView


//-------------------------------------------------------------------
Static Function ZZ1BPOS( oModel )
Local nOperation := oModel:GetOperation()
Local lRet       := .T.

If nOperation == MODEL_OPERATION_UPDATE
	If Empty( oModel:GetValue( 'ZZ1MASTER', 'ZZ1_CODE' ) )
		Help( ,, 'HELP',, 'Informe O CODIGO', 1, 0)
		lRet := .F.
	EndIf
EndIf

Return lRet

//-------------------------------------------------------------------
Static Function ZZ1BACT( oModel )  // Passa o model sem dados
Local aArea      := GetArea()
Local cQuery     := ''
Local cTmp       := ''
Local lRet       := .T.
Local nOperation := oModel:GetOperation()

If nOperation == MODEL_OPERATION_DELETE .AND. lRet

	cTmp    := GetNextAlias()

	cQuery  := "SELECT ZZ1_CODE FROM " + RetSqlName( 'ZZ1' ) + " ZZ1 "
	cQuery  += " WHERE EXISTS ( "
	cQuery  += "       SELECT 1 FROM " + RetSqlName( 'SB1' ) + " SB1 "
	cQuery  += "        WHERE B1_CODIGO = ZZ1_CODE"
	cQuery  += "          AND SB1.D_E_L_E_T_ = ' ' ) "
	cQuery  += "   AND ZZ1_CODE = '" + ZZ1->ZZ1_CODE  + "' "
	cQuery  += "   AND ZZ1.D_E_L_E_T_ = ' ' "

	dbUseArea( .T., "TOPCONN", TcGenQry( ,, cQuery ) , cTmp, .F., .T. )

	lRet := (cTmp)->( EOF() )

	(cTmp)->( dbCloseArea() )

	// If lRet
	// 	cQuery  := "SELECT ZZ1_CODE FROM " + RetSqlName( 'ZZ1' ) + " ZZ1 "
	// 	cQuery  += " WHERE EXISTS ( "
	// 	cQuery  += "       SELECT 1 FROM " + RetSqlName( 'ZA5' ) + " ZA5 "
	// 	cQuery  += "        WHERE ZA5_INTER = ZZ1_CODE"
	// 	cQuery  += "          AND ZA5.D_E_L_E_T_ = ' ' ) "
	// 	cQuery  += "   AND ZZ1_CODE = '" + ZZ1->ZZ1_CODE  + "' "
	// 	cQuery  += "   AND ZZ1.D_E_L_E_T_ = ' ' "

	// 	dbUseArea( .T., "TOPCONN", TcGenQry( ,, cQuery ) , cTmp, .F., .T. )

	// 	lRet := (cTmp)->( EOF() )

	// 	(cTmp)->( dbCloseArea() )

	// EndIf

	If !lRet
		Help( ,, 'HELP',, 'Este item do Cadastro 01 nao pode ser exclucodeo.', 1, 0)
	EndIf

EndIf

RestArea( aArea )

Return lRet


//-------------------------------------------------------------------
Static Function ZZ1STRU( cCampo )
Local lRet := .T.

If cCampo == 'ZZ1_STATUS'
	lRet := .F.
EndIf

Return lRet
