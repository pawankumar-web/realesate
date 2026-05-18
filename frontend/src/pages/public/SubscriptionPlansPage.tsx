import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/button'

const plans = [
  { name: 'Free', price: '$0', features: ['5 Listings', 'Basic Analytics', 'Email Support'], popular: false },
  { name: 'Basic', price: '$9', features: ['25 Listings', '2 Featured Listings', 'Advanced Analytics', 'Chat Support'], popular: true },
  { name: 'Pro', price: '$29', features: ['100 Listings', '10 Featured Listings', 'Premium Analytics', 'Priority Support'], popular: false },
  { name: 'Enterprise', price: '$79', features: ['Unlimited Listings', '25 Featured Listings', 'Dedicated Manager', 'API Access'], popular: false },
]

export default function SubscriptionPlansPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-2">Subscription Plans</h1>
      <p className="text-center text-muted-foreground mb-10">Choose the perfect plan for your needs</p>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <div key={plan.name} className={`border rounded-lg p-6 bg-card ${plan.popular ? 'ring-2 ring-primary' : ''}`}>
            {plan.popular && <p className="text-xs font-semibold text-primary mb-2">MOST POPULAR</p>}
            <h3 className="text-xl font-bold">{plan.name}</h3>
            <p className="text-3xl font-bold mt-2">{plan.price}<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
            <ul className="mt-4 space-y-2 text-sm">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2">✓ {f}</li>
              ))}
            </ul>
            <Link to="/register"><Button className="w-full mt-6">{plan.price === '$0' ? 'Get Started' : 'Subscribe'}</Button></Link>
          </div>
        ))}
      </div>
    </div>
  )
}
