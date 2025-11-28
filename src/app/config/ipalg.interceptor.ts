import { HttpInterceptorFn } from '@angular/common/http';

export const Iplaginterceptor: HttpInterceptorFn = (req, next) => {
  req = req.clone({
    setHeaders: {
      'X-User-Permissions': ['dashboar-create', 'test'],
    },
  });

  return next(req);
};
