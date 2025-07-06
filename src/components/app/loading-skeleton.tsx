import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface LoadingSkeletonProps {
  analysisType: 'skin' | 'tablet';
}

export function LoadingSkeleton({ analysisType }: LoadingSkeletonProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold font-headline text-center text-muted-foreground">Analyzing...</h2>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/2 rounded-md" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-3/4 rounded-md" />
          </div>
        </CardContent>
      </Card>
      {analysisType === 'skin' && (
        <>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/3 rounded-md" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-5/6 rounded-md" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-2/5 rounded-md" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-4/5 rounded-md" />
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
