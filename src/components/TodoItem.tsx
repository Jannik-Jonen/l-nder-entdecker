import { TodoItem as TodoItemType, categoryLabels, categoryIcons } from '@/types/travel';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface TodoItemProps {
  todo: TodoItemType;
  onToggle: (id: string) => void;
}

export const TodoItemComponent = ({ todo, onToggle }: TodoItemProps) => {
  const categoryStyles: Record<TodoItemType['category'], string> = {
    visa: 'border-l-primary bg-primary/5',
    health: 'border-l-success bg-success/5',
    budget: 'border-l-accent bg-accent/5',
    preparation: 'border-l-secondary bg-secondary/5',
    transport: 'border-l-muted-foreground bg-muted/50',
  };

  return (
    <div
      className={cn(
        'group flex items-start gap-4 rounded-lg border-l-4 p-4 transition-all duration-200 hover:shadow-sm',
        categoryStyles[todo.category],
        todo.completed && 'opacity-60'
      )}
    >
      <Checkbox
        checked={todo.completed}
        onCheckedChange={() => onToggle(todo.id)}
        className="mt-0.5 h-5 w-5 rounded-md border-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
      />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">{categoryIcons[todo.category]}</span>
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {categoryLabels[todo.category]}
          </span>
        </div>
        <h4
          className={cn(
            'font-medium text-card-foreground transition-all',
            todo.completed && 'line-through text-muted-foreground'
          )}
        >
          {todo.title}
        </h4>
        {todo.description && (
          <p className="mt-1 text-sm text-muted-foreground">{todo.description}</p>
        )}
      </div>
    </div>
  );
};
