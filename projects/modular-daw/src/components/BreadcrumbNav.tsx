import { useScopeStore } from '../store/scope-store';

export function BreadcrumbNav() {
  const scopeStack = useScopeStore(s => s.scopeStack);
  const popToDepth = useScopeStore(s => s.popToDepth);

  if (scopeStack.length <= 1) return null;

  return (
    <nav className="daw-breadcrumb" aria-label="Module scope">
      {scopeStack.map((entry, i) => {
        const isLast = i === scopeStack.length - 1;
        return (
          <span key={i} className="daw-breadcrumb__item">
            {i > 0 && <span className="daw-breadcrumb__sep">&rsaquo;</span>}
            {isLast ? (
              <span className="daw-breadcrumb__current">{entry.label}</span>
            ) : (
              <button
                className="daw-breadcrumb__link"
                onClick={() => popToDepth(i)}
              >
                {entry.label}
              </button>
            )}
          </span>
        );
      })}
    </nav>
  );
}
