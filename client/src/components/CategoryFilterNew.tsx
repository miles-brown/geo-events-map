import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { CATEGORIES, TIME_PERIODS, type TimePeriod } from "@shared/categories";

interface CategoryFilterProps {
  selectedCategories: string[];
  selectedSubcategories: string[];
  selectedTimePeriod: TimePeriod;
  onCategoryChange: (categories: string[]) => void;
  onSubcategoryChange: (subcategories: string[]) => void;
  onTimePeriodChange: (period: TimePeriod) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function CategoryFilterNew({
  selectedCategories,
  selectedSubcategories,
  selectedTimePeriod,
  onCategoryChange,
  onSubcategoryChange,
  onTimePeriodChange,
  isCollapsed,
  onToggleCollapse,
}: CategoryFilterProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const toggleCategory = (categoryId: string) => {
    const newSelected = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];
    onCategoryChange(newSelected);
  };

  const toggleSubcategory = (subcategoryId: string) => {
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

  const clearAll = () => {
    onCategoryChange([]);
    onSubcategoryChange([]);
    onTimePeriodChange("all");
  };

  if (isCollapsed) {
    return (
      <div className="bg-card border-r border-border h-full w-12 flex flex-col items-center py-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="mb-4"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <div className="writing-mode-vertical text-sm font-medium">Filters</div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950/90 backdrop-blur-md border-r border-blue-500/30 h-full w-80 flex flex-col shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-blue-500/30 bg-slate-900/50">
        <h2 className="font-semibold text-lg tracking-wider text-blue-400">FILTERS</h2>
        <Button variant="ghost" size="icon" onClick={onToggleCollapse}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Time Period Filter */}
          <div>
            <h3 className="font-medium text-xs mb-3 tracking-wider text-slate-400 uppercase">Time Period</h3>
            <div className="space-y-2">
              {TIME_PERIODS.map((period) => (
                <Button
                  key={period.id}
                  variant={selectedTimePeriod === period.id ? "default" : "outline"}
                  size="sm"
                  className={`w-full justify-start ${selectedTimePeriod === period.id ? "bg-blue-600 hover:bg-blue-700 border-blue-500" : "border-slate-700 hover:bg-slate-800 hover:border-blue-500/50"}`}
                  onClick={() => onTimePeriodChange(period.id)}
                >
                  {period.label}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Category Filters */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-xs tracking-wider text-slate-400 uppercase">Categories</h3>
              {(selectedCategories.length > 0 || selectedSubcategories.length > 0) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAll}
                  className="h-auto py-1 px-2 text-xs hover:text-blue-400 transition-colors"
                >
                  Clear All
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
                        className={`flex-1 justify-start gap-2 ${isSelected ? '' : 'hover:bg-slate-800/50 hover:border-blue-500/30 transition-all'}`}
                        onClick={() => toggleCategory(category.id)}
                        style={{
                          backgroundColor: isSelected ? category.color : undefined,
                          borderColor: isSelected ? category.color : 'rgba(51, 65, 85, 0.5)',
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
                        className="h-8 w-8"
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
                              className="w-full justify-start text-xs hover:bg-slate-800 transition-colors"
                              onClick={() => toggleSubcategory(subcat.id)}
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
      {(selectedCategories.length > 0 || selectedSubcategories.length > 0) && (
        <div className="border-t border-border p-4">
          <div className="text-xs text-muted-foreground mb-2">
            Active: {selectedCategories.length} categories, {selectedSubcategories.length} subcategories
          </div>
        </div>
      )}
    </div>
  );
}
