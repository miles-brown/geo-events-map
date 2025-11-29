import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onCategorySelect,
  isCollapsed,
  onToggleCollapse,
}: CategoryFilterProps) {
  return (
    <div
      className={cn(
        "bg-card border-r border-border h-full transition-all duration-300 flex flex-col",
        isCollapsed ? "w-12" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            <h2 className="font-semibold">Categories</h2>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="ml-auto"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Category List */}
      {!isCollapsed && (
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => onCategorySelect(null)}
            >
              All Events
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="w-full justify-start capitalize"
                onClick={() => onCategorySelect(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </ScrollArea>
      )}

      {/* Collapsed state icon */}
      {isCollapsed && (
        <div className="flex-1 flex items-start justify-center pt-4">
          <Filter className="h-5 w-5 text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
