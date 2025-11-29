import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { CATEGORIES, TIME_PERIODS, type TimePeriod } from "@shared/categories";
import { LONDON_BOROUGHS } from "@shared/boroughs";
import { soundEffects } from "@/lib/sounds";

interface CategoryFilterProps {
  selectedCategories: string[];
  selectedSubcategories: string[];
  selectedTimePeriod: TimePeriod;
  selectedBoroughs: string[];
  onCategoryChange: (categories: string[]) => void;
  onSubcategoryChange: (subcategories: string[]) => void;
  onTimePeriodChange: (period: TimePeriod) => void;
  onBoroughChange: (boroughs: string[]) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function CategoryFilterNew({
  selectedCategories,
  selectedSubcategories,
  selectedTimePeriod,
  selectedBoroughs,
  onCategoryChange,
  onSubcategoryChange,
  onTimePeriodChange,
  onBoroughChange,
  isCollapsed,
  onToggleCollapse,
}: CategoryFilterProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [boroughsExpanded, setBoroughsExpanded] = useState(false);

  const toggleCategory = (categoryId: string) => {
    soundEffects.click();
    const newSelected = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];
    onCategoryChange(newSelected);
  };

  const toggleSubcategory = (subcategoryId: string) => {
    soundEffects.click();
    const newSelected = selectedSubcategories.includes(subcategoryId)
      ? selectedSubcategories.filter(id => id !== subcategoryId)
      : [...selectedSubcategories, subcategoryId];
    onSubcategoryChange(newSelected);
  };

  const toggleExpanded = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleBorough = (borough: string) => {
    soundEffects.click();
    const newSelected = selectedBoroughs.includes(borough)
      ? selectedBoroughs.filter(b => b !== borough)
      : [...selectedBoroughs, borough];
    onBoroughChange(newSelected);
  };

  const clearAll = () => {
    onCategoryChange([]);
    onSubcategoryChange([]);
    onTimePeriodChange("all");
    onBoroughChange([]);
  };

  if (isCollapsed) {
    return (
      <div className="bg-black border-r-2 border-red-600 h-full w-12 flex flex-col items-center py-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="mb-4 text-red-500 hover:text-red-400 hover:bg-red-950"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <div className="writing-mode-vertical text-sm font-stencil tracking-widest text-green-400">FILTERS</div>
      </div>
    );
  }

  return (
    <div className="bg-black/95 backdrop-blur-md border-r-2 border-red-600 h-full w-80 flex flex-col shadow-2xl relative">
      {/* Top classification bar */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500 to-transparent" />
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b-2 border-red-900 bg-black/80">
        <h2 className="font-tactical text-xl tracking-[0.3em] text-red-500">FILTERS</h2>
        <Button variant="ghost" size="icon" onClick={onToggleCollapse} className="text-red-500 hover:text-red-400 hover:bg-red-950">
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Time Period Filter */}
          <div>
            <h3 className="font-stencil text-xs mb-3 tracking-[0.3em] text-green-400 uppercase border-b border-red-900 pb-2">TIME PERIOD</h3>
            <div className="space-y-2">
              {TIME_PERIODS.map((period) => (
                <Button
                  key={period.id}
                  variant={selectedTimePeriod === period.id ? "default" : "outline"}
                  size="sm"
                  className={`w-full justify-start font-mono-tech tracking-wider ${selectedTimePeriod === period.id ? "bg-red-600 hover:bg-red-700 border-red-500 text-black font-bold" : "border-red-900 hover:bg-red-950 hover:border-red-600 text-green-400"}`}
                  onClick={() => {
                    soundEffects.select();
                    onTimePeriodChange(period.id);
                  }}
                  onMouseEnter={() => soundEffects.hover()}
                >
                  {period.label}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* London Borough Filter */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-stencil text-xs tracking-[0.3em] text-green-400 uppercase border-b border-red-900 pb-2 flex-1">LONDON BOROUGHS</h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setBoroughsExpanded(!boroughsExpanded)}
              >
                {boroughsExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>

            {boroughsExpanded && (
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {LONDON_BOROUGHS.map((borough) => {
                  const isSelected = selectedBoroughs.includes(borough);
                  return (
                    <Button
                      key={borough}
                      variant={isSelected ? "default" : "ghost"}
                      size="sm"
                      className={`w-full justify-start text-xs font-mono-tech ${
                        isSelected
                          ? "bg-yellow-600 hover:bg-yellow-700 border-yellow-500 text-black font-bold"
                          : "hover:bg-red-950 hover:border-red-600 transition-all text-green-400"
                      }`}
                      onClick={() => toggleBorough(borough)}
                      onMouseEnter={() => soundEffects.hover()}
                    >
                      {borough}
                    </Button>
                  );
                })}
              </div>
            )}

            {selectedBoroughs.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {selectedBoroughs.map((borough) => (
                  <Badge
                    key={borough}
                    variant="secondary"
                    className="text-xs bg-yellow-600/20 border-yellow-500/50 text-yellow-300 font-mono"
                  >
                    {borough}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Category Filters */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-stencil text-xs tracking-[0.3em] text-green-400 uppercase border-b border-red-900 pb-2 flex-1">CATEGORIES</h3>
              {(selectedCategories.length > 0 || selectedSubcategories.length > 0) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAll}
                  className="h-auto py-1 px-2 text-xs hover:text-red-400 transition-colors text-red-500 font-stencil tracking-wider"
                >
                  CLEAR ALL
                </Button>
              )}
            </div>

            <div className="space-y-2">
              {CATEGORIES.map((category) => {
                const isExpanded = expandedCategories.has(category.id);
                const isSelected = selectedCategories.includes(category.id);
                const hasSelectedSubcats = category.subcategories.some(sub =>
                  selectedSubcategories.includes(sub.id)
                );

                return (
                  <div key={category.id} className="space-y-1">
                    {/* Main Category */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant={isSelected ? "default" : "outline"}
                        size="sm"
                        className={`flex-1 justify-start gap-2 font-mono-tech ${isSelected ? 'text-black font-bold' : 'hover:bg-red-950/50 hover:border-red-600/50 transition-all text-green-400'}`}
                        onClick={() => toggleCategory(category.id)}
                        onMouseEnter={() => soundEffects.hover()}
                        style={{
                          backgroundColor: isSelected ? category.color : undefined,
                          borderColor: isSelected ? category.color : 'rgba(127, 29, 29, 0.5)',
                        }}
                      >
                        <span>{category.icon}</span>
                        <span className="flex-1 text-left">{category.label}</span>
                        {hasSelectedSubcats && !isSelected && (
                          <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                            {selectedSubcategories.filter(sub =>
                              category.subcategories.some(c => c.id === sub)
                            ).length}
                          </Badge>
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-green-400 hover:text-red-400 hover:bg-red-950"
                        onClick={() => toggleExpanded(category.id)}
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    {/* Subcategories */}
                    {isExpanded && (
                      <div className="ml-6 space-y-1">
                        {category.subcategories.map((subcat) => {
                          const isSubSelected = selectedSubcategories.includes(subcat.id);
                          return (
                            <Button
                              key={subcat.id}
                              variant={isSubSelected ? "secondary" : "ghost"}
                              size="sm"
                              className="w-full justify-start text-xs hover:bg-red-950 transition-colors font-mono text-green-400"
                              onClick={() => toggleSubcategory(subcat.id)}
                              onMouseEnter={() => soundEffects.hover()}
                            >
                              {subcat.label}
                            </Button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Active Filters Summary */}
      {(selectedCategories.length > 0 || selectedSubcategories.length > 0 || selectedBoroughs.length > 0) && (
        <div className="border-t-2 border-red-900 p-4 bg-black/80">
          <div className="text-[10px] text-green-400 mb-2 font-stencil tracking-widest">
            ACTIVE FILTERS: <span className="text-red-500 font-bold">{selectedCategories.length}</span> CAT / <span className="text-yellow-500 font-bold">{selectedSubcategories.length}</span> SUB / <span className="text-cyan-500 font-bold">{selectedBoroughs.length}</span> LOC
          </div>
        </div>
      )}
    </div>
  );
}
