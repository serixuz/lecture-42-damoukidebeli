import { Component, input, output } from '@angular/core';

import { EMPTY_FILTER, ProductFilter } from '../../models/product-filter.model';

type TriState = 'any' | 'yes' | 'no';

@Component({
  selector: 'app-filter-bar',
  templateUrl: './filter-bar.html',
  styleUrl: './filter-bar.css',
})
export class FilterBar {
  readonly filter = input<ProductFilter>(EMPTY_FILTER);
  readonly filterChange = output<ProductFilter>();

  protected readonly options: readonly { value: TriState; label: string }[] = [
    { value: 'any', label: 'Any' },
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' },
  ];

  protected toTriState(value: boolean | null): TriState {
    return value === null ? 'any' : value ? 'yes' : 'no';
  }

  protected setNuts(value: TriState): void {
    this.update({ nuts: this.fromTriState(value) });
  }

  protected setVegeterian(value: TriState): void {
    this.update({ vegeterian: this.fromTriState(value) });
  }

  protected toggleAnySpiciness(event: Event): void {
    const any = (event.target as HTMLInputElement).checked;
    this.update({ spiciness: any ? null : 0 });
  }

  protected setSpiciness(event: Event): void {
    this.update({ spiciness: (event.target as HTMLInputElement).valueAsNumber });
  }

  protected reset(): void {
    this.filterChange.emit({ ...EMPTY_FILTER });
  }

  private fromTriState(value: TriState): boolean | null {
    return value === 'any' ? null : value === 'yes';
  }

  private update(patch: Partial<ProductFilter>): void {
    this.filterChange.emit({ ...this.filter(), ...patch });
  }
}
