/**
 * SEOTaskChecklist
 * 
 * Dynamic task checklist component for SEO improvements.
 * Auto-generates tasks based on page analysis.
 */

import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { 
  ListTodo, 
  ChevronDown, 
  RefreshCw, 
  Plus, 
  X,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { useSEOTasks, type SEOTask } from '../hooks/useSEOTasks';
import type { SEOIssue } from '../hooks/useSEOAnalysis';

interface SEOTaskChecklistProps {
  pageId: string;
  languageCode: string;
  issues: SEOIssue[];
  seoScore: number;
  aeoScore: number;
  geoScore: number;
}

const priorityColors = {
  high: 'text-red-600 dark:text-red-400',
  medium: 'text-yellow-600 dark:text-yellow-400',
  low: 'text-blue-600 dark:text-blue-400',
};

const priorityBadgeVariants = {
  high: 'border-red-200 bg-red-50/50 text-red-600 dark:bg-red-500/10 dark:border-red-500/30',
  medium: 'border-yellow-200 bg-yellow-50/50 text-yellow-600 dark:bg-yellow-500/10 dark:border-yellow-500/30',
  low: 'border-blue-200 bg-blue-50/50 text-blue-600 dark:bg-blue-500/10 dark:border-blue-500/30',
};

export function SEOTaskChecklist({ 
  pageId, 
  languageCode, 
  issues, 
  seoScore, 
  aeoScore, 
  geoScore 
}: SEOTaskChecklistProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  
  const {
    tasks,
    isLoading,
    completedCount,
    totalCount,
    highPriorityPending,
    generateTasks,
    isGenerating,
    toggleTask,
    deleteTask,
    addTask,
  } = useSEOTasks(pageId, languageCode);

  // Auto-generate tasks when issues change
  useEffect(() => {
    if (issues.length > 0 && tasks.length === 0 && !isLoading) {
      generateTasks({ issues, seoScore, aeoScore, geoScore });
    }
  }, [issues, tasks.length, isLoading]);

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      addTask({ title: newTaskTitle.trim() });
      setNewTaskTitle('');
      setShowAddForm(false);
    }
  };

  const incompleteTasks = tasks.filter(t => !t.is_completed);
  const completedTasks = tasks.filter(t => t.is_completed);

  if (!pageId) return null;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button 
          variant="ghost" 
          className="w-full justify-between h-7 px-2 text-xs"
          aria-expanded={isOpen}
        >
          <span className="flex items-center gap-1.5">
            <ListTodo className="h-3 w-3" />
            SEO Tasks
            {totalCount > 0 && (
              <Badge variant="outline" className="h-4 px-1 text-[9px]">
                {completedCount}/{totalCount}
              </Badge>
            )}
            {highPriorityPending > 0 && (
              <Badge variant="outline" className={cn("h-4 px-1 text-[9px]", priorityBadgeVariants.high)}>
                {highPriorityPending} urgent
              </Badge>
            )}
          </span>
          <ChevronDown className={cn(
            "h-3.5 w-3.5 transition-transform duration-200",
            isOpen && "rotate-180"
          )} />
        </Button>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="pt-2 animate-accordion-down">
        <div className="space-y-2">
          {/* Action Bar */}
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-6 px-2 text-[10px]"
              onClick={() => generateTasks({ issues, seoScore, aeoScore, geoScore })}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <Loader2 className="h-3 w-3 animate-spin mr-1" />
              ) : (
                <RefreshCw className="h-3 w-3 mr-1" />
              )}
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-6 px-2 text-[10px]"
              onClick={() => setShowAddForm(!showAddForm)}
            >
              <Plus className="h-3 w-3 mr-1" />
              Add
            </Button>
          </div>

          {/* Add Task Form */}
          {showAddForm && (
            <div className="flex items-center gap-1 p-2 rounded-md bg-muted/30 border">
              <Input
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="New task..."
                className="h-6 text-xs flex-1"
                onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
              />
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={handleAddTask}
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => setShowAddForm(false)}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}

          {/* Incomplete Tasks */}
          {!isLoading && incompleteTasks.length === 0 && completedTasks.length === 0 && (
            <div className="text-center py-4 text-[10px] text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 mx-auto mb-1 text-green-500" />
              No pending tasks
            </div>
          )}

          {incompleteTasks.length > 0 && (
            <div className="space-y-1">
              {incompleteTasks.slice(0, 10).map((task) => (
                <TaskItem 
                  key={task.id} 
                  task={task} 
                  onToggle={toggleTask}
                  onDelete={deleteTask}
                />
              ))}
              {incompleteTasks.length > 10 && (
                <p className="text-[9px] text-muted-foreground text-center">
                  +{incompleteTasks.length - 10} more tasks
                </p>
              )}
            </div>
          )}

          {/* Completed Tasks */}
          {completedTasks.length > 0 && (
            <div className="pt-2 border-t">
              <p className="text-[9px] font-medium text-muted-foreground mb-1">
                Completed ({completedTasks.length})
              </p>
              <div className="space-y-1 opacity-60">
                {completedTasks.slice(0, 3).map((task) => (
                  <TaskItem 
                    key={task.id} 
                    task={task} 
                    onToggle={toggleTask}
                    onDelete={deleteTask}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

function TaskItem({ 
  task, 
  onToggle, 
  onDelete 
}: { 
  task: SEOTask; 
  onToggle: (input: { taskId: string; completed: boolean }) => void;
  onDelete: (taskId: string) => void;
}) {
  const priorityIcon = {
    high: <AlertCircle className="h-2.5 w-2.5" />,
    medium: <AlertTriangle className="h-2.5 w-2.5" />,
    low: null,
  };

  return (
    <div className={cn(
      "flex items-start gap-2 p-1.5 rounded-md text-xs group",
      task.is_completed ? "bg-muted/20" : "bg-muted/30 hover:bg-muted/40"
    )}>
      <Checkbox
        checked={task.is_completed}
        onCheckedChange={(checked) => 
          onToggle({ taskId: task.id, completed: checked as boolean })
        }
        className="mt-0.5 h-3.5 w-3.5"
      />
      <div className="flex-1 min-w-0">
        <p className={cn(
          "leading-tight",
          task.is_completed && "line-through text-muted-foreground"
        )}>
          {task.task_title}
        </p>
        {task.task_description && !task.is_completed && (
          <p className="text-[9px] text-muted-foreground mt-0.5 line-clamp-1">
            {task.task_description}
          </p>
        )}
      </div>
      <div className="flex items-center gap-1 shrink-0">
        {priorityIcon[task.priority] && (
          <span className={priorityColors[task.priority]}>
            {priorityIcon[task.priority]}
          </span>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => onDelete(task.id)}
        >
          <X className="h-3 w-3 text-muted-foreground hover:text-destructive" />
        </Button>
      </div>
    </div>
  );
}
