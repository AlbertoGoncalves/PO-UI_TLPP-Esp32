import { Component, OnInit } from '@angular/core';
import {
  PoCheckboxGroupOption,
  PoLookupColumn,
  PoLookupFilter,
  PoLookupLiterals,
  PoDynamicFormField,
  PoSelectOption,
  PoTableColumnSpacing,
  PoRadioGroupOption,
} from '@po-ui/ng-components';

import { PackageTesteService } from './package-teste.service';

@Component({
  selector: 'sample-po-lookup-labs',
  templateUrl: './package-teste.component.html',
  providers: [PackageTesteService],
})
export class PackageTesteComponent implements OnInit {
  columns: Array<PoLookupColumn> = [];
  columnsName: Array<string> = [];
  customLiterals: PoLookupLiterals | undefined;
  event: string | undefined;
  fieldFormat: Array<string> | undefined;
  formatField: string | undefined;
  fieldLabel: string = '';
  fieldValue: string = '';
  filterService: PoLookupFilter | string | undefined;
  help: string | undefined;
  label: string | undefined;
  literals: string = '';
  lookup: any;
  placeholder: string = '';
  properties: Array<string> = [];
  fieldErrorMessage: string = '';
  advancedFilters: string = '';
  customAdvancedFilters: Array<PoDynamicFormField> = [];
  spacing: PoTableColumnSpacing = PoTableColumnSpacing.Medium;

  public readonly columnsOptions: Array<PoCheckboxGroupOption> = [
    { value: 'id', label: 'Id' },
    { value: 'name', label: 'Name' },
    { value: 'email', label: 'Email' },
  ];

  public readonly fieldLabelOptions: Array<PoSelectOption> = [
    { value: 'label', label: 'Label' },
    ...this.columnsOptions.map((option) => ({ value: option.value, label: option.label })),
  ];

  public readonly fieldValueOptions: Array<PoSelectOption> = [
    { value: 'value', label: 'Value' },
    ...this.columnsOptions.map((option) => ({ value: option.value, label: option.label })),
  ];

  public readonly propertiesOptions: Array<PoCheckboxGroupOption> = [
    { value: 'clean', label: 'Clean' },
    { value: 'disabled', label: 'Disabled' },
    { value: 'noAutocomplete', label: 'No Autocomplete' },
    { value: 'optional', label: 'Optional' },
    { value: 'required', label: 'Required' },
    { value: 'showRequired', label: 'Show Required' },
    { value: 'infiniteScroll', label: 'Infinite Scroll' },
    { value: 'multiple', label: 'Multiple' },
    { value: 'autoHeight', label: 'Auto Height' },
    { value: 'hideColumnsManager', label: 'Hide Columns Manager' },
    { value: 'textWrap', label: 'Text Wrap' },
    { value: 'virtualScroll', label: 'Virtual Scroll' },
  ];

  private readonly columnsDefinition = {
    id: <PoLookupColumn>{ property: 'id', label: 'Id' },
    name: <PoLookupColumn>{ property: 'name', label: 'Name' },
    email: <PoLookupColumn>{ property: 'email', label: 'Email' },
  };

  public readonly typeSpacing: Array<PoRadioGroupOption> = [
    { label: 'Small', value: PoTableColumnSpacing.Small },
    { label: 'Medium', value: PoTableColumnSpacing.Medium },
    { label: 'Large', value: PoTableColumnSpacing.Large },
  ];

  constructor(public sampleFilterService: PackageTesteService) {}

  ngOnInit(): void {
    this.restore();
  }

  changeEvent(event: string): void {
    this.event = event;
  }

  changeLiterals(): void {
    try {
      this.customLiterals = JSON.parse(this.literals);
    } catch {
      this.customLiterals = undefined;
    }
  }

  onFieldFormatChange(event: any): void {
    try {
      this.fieldFormat = JSON.parse(event.target.value);
    } catch {
      this.fieldFormat = undefined;
    }
  }

  changeAdvancedFilters(): void {
    try {
      this.customAdvancedFilters = JSON.parse(this.advancedFilters);
    } catch {
      this.customAdvancedFilters = [];
    }
  }

  restore(): void {
    this.columnsName = ['id', 'name'];
    this.customLiterals = undefined;
    this.updateColumns();

    this.fieldLabel = 'name';
    this.fieldValue = 'id';
    this.fieldFormat = undefined;
    this.formatField = undefined;
    this.event = undefined;
    this.filterService = undefined;
    this.label = undefined;
    this.literals = '';
    this.help = undefined;
    this.lookup = undefined;
    this.placeholder = '';
    this.properties = [];
    this.fieldErrorMessage = '';
    this.customAdvancedFilters = [];
  }

  updateColumns(): void {
    // this.columns = this.columnsName.map((column) => this.columnsDefinition[column]);
  }
}
